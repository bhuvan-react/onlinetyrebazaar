package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.application.dto.*;
import com.tyreplus.dealer.domain.entity.RechargePackage;
import com.tyreplus.dealer.domain.entity.Transaction;
import com.tyreplus.dealer.domain.entity.TransactionType;
import com.tyreplus.dealer.domain.entity.Wallet;
import com.tyreplus.dealer.domain.repository.RechargePackageRepository;
import com.tyreplus.dealer.domain.repository.TransactionRepository;
import com.tyreplus.dealer.domain.repository.WalletRepository;
import com.tyreplus.dealer.infrastructure.payment.RazorpayAdapter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

/**
 * Application service for handling wallet operations.
 */
@Service
public class WalletService {

        private final WalletRepository walletRepository;
        private final TransactionRepository transactionRepository;
        private final RazorpayAdapter razorpayAdapter;
        private final RechargePackageRepository packageRepository;

        public WalletService(WalletRepository walletRepository,
                        TransactionRepository transactionRepository,
                        RazorpayAdapter razorpayAdapter,
                        RechargePackageRepository packageRepository) {
                this.walletRepository = walletRepository;
                this.transactionRepository = transactionRepository;
                this.razorpayAdapter = razorpayAdapter;
                this.packageRepository = packageRepository;
        }

        /**
         * Updated to return split balances and total credits.
         */
        public WalletResponse getWalletDetails(UUID dealerId) {
                Wallet wallet = walletRepository.findByDealerId(dealerId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Wallet not found for dealer: " + dealerId));

                List<Transaction> transactions = transactionRepository.findByDealerId(dealerId);

                List<WalletResponse.TransactionResponse> transactionResponses = transactions.stream()
                                .map(tx -> new WalletResponse.TransactionResponse(
                                                tx.getId().toString(),
                                                tx.getDescription() != null ? tx.getDescription()
                                                                : (tx.getType() == TransactionType.CREDIT
                                                                                ? "Added Money"
                                                                                : "Deducted Money"),
                                                tx.getTimestamp().format(DateTimeFormatter.ISO_DATE_TIME),
                                                tx.getCredits(),
                                                tx.getType().name().toLowerCase()))
                                .toList();

                // Pass total, purchased, and bonus separately to the DTO
                return new WalletResponse(
                                wallet.getTotalCredits(),
                                wallet.getPurchasedCredits(),
                                wallet.getBonusCredits(),
                                transactionResponses);
        }

        @Transactional(readOnly = true)
        public List<PackageResponse> getPackages() {
                return packageRepository.findActivePackages().stream() // Changed to findAll for standard repository
                                                                       // usage
                                .filter(RechargePackage::isActive)
                                .map(pkg -> new PackageResponse(
                                                pkg.getId().toString(),
                                                pkg.getName(),
                                                pkg.getPriceInInr(),
                                                pkg.getTotalCredits(), // Show total value to user
                                                pkg.isPopular()))
                                .toList();
        }

        @Transactional
        public PaymentOrderResponse initiateRecharge(UUID dealerId, UUID packageId) {
                try {
                        RechargePackage pkg = packageRepository.findById(packageId)
                                        .orElseThrow(() -> new IllegalArgumentException("Package not found"));

                        // Razorpay expects amount in Paise
                        int amountInPaise = pkg.getPriceInInr() * 100;
                        String gatewayOrderId = razorpayAdapter.createGatewayOrder(amountInPaise);

                        return new PaymentOrderResponse(
                                        gatewayOrderId,
                                        amountInPaise,
                                        "INR",
                                        razorpayAdapter.getKeyId(),
                                        pkg.getName());
                } catch (IllegalArgumentException e) {
                        throw e; // let GlobalExceptionHandler return 400
                } catch (Exception e) {
                        throw new RuntimeException("Failed to initiate payment with gateway", e);
                }
        }

        @Transactional
        public WalletResponse completeRecharge(UUID dealerId, PaymentVerificationRequest request) {
                // 1. Digital Signature Verification
                boolean isVerified = razorpayAdapter.verifySignature(
                                request.gatewayOrderId(),
                                request.gatewayPaymentId(),
                                request.gatewaySignature());

                if (!isVerified) {
                        throw new SecurityException("Payment verification failed. Invalid signature.");
                }

                // 1.5. Idempotency Check (Prevent Double Spend)
                if (transactionRepository.existsByPaymentId(request.gatewayPaymentId())) {
                        // Already processed, return current wallet state
                        // Ideally strictly we should return the exact transaction response, but for MVP
                        // returning wallet is safe
                        return getWalletDetails(dealerId);
                }

                // 2. Load Wallet and Package
                Wallet wallet = walletRepository.findByDealerIdWithLock(dealerId)
                                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

                RechargePackage pkg = packageRepository.findById(UUID.fromString(request.packageId()))
                                .orElseThrow(() -> new IllegalArgumentException("Invalid Package"));

                // 3. Update Balance using split logic
                wallet.credit(pkg.getBaseCredits(), pkg.getBonusCredits());
                walletRepository.save(wallet);

                // 4. Record Transaction
                Transaction transaction = new Transaction(
                                wallet.getId(),
                                dealerId,
                                TransactionType.CREDIT,
                                pkg.getTotalCredits(),
                                pkg.getBaseCredits(), // Purchased
                                pkg.getBonusCredits(), // Bonus
                                "Package Purchase: " + pkg.getName() + " (Incl. Bonus)",
                                request.gatewayPaymentId()); // Store paymentId
                transactionRepository.save(transaction);

                return getWalletDetails(dealerId);
        }

        /**
         * Updated testRecharge to also handle the split.
         */
        @Transactional
        public WalletResponse testRecharge(UUID dealerId, RechargeRequest request) {
                Wallet wallet = walletRepository.findByDealerIdWithLock(dealerId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Wallet not found for dealer: " + dealerId));

                RechargePackage pkg = packageRepository.findById(UUID.fromString(request.packageId()))
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Package not found: " + request.packageId()));

                // Credit split
                wallet.credit(pkg.getBaseCredits(), pkg.getBonusCredits());
                walletRepository.save(wallet);

                Transaction transaction = new Transaction(
                                wallet.getId(),
                                dealerId,
                                TransactionType.CREDIT,
                                pkg.getTotalCredits(),
                                pkg.getBaseCredits(), // Purchased
                                pkg.getBonusCredits(), // Bonus
                                "TEST Package Purchase: " + pkg.getName(),
                                "TEST_" + UUID.randomUUID()); // Dummy paymentId for test
                transactionRepository.save(transaction);

                return getWalletDetails(dealerId);
        }
}
