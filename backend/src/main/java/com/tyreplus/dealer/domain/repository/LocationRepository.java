package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.ServiceableLocation;
import java.util.Optional;

public interface LocationRepository {
    Optional<ServiceableLocation> findByPincode(String pincode);
}
