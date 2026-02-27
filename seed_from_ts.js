const fs = require('fs');

// Read the TS file
let pt = fs.readFileSync('frontend/web/lib/tyre-data.ts', 'utf8');

// Strip out the interface and everything before the array declaration
pt = pt.substring(pt.indexOf('export const tyreData'));
pt = pt.replace('export const tyreData: Tyre[] =', 'const tyreData =');

// Strip out trailing types or exports that might be at the end of the file
const scriptContent = pt + '\nmodule.exports = tyreData;';

// Write to a temporary js file to require it
fs.writeFileSync('temp_tyredata.js', scriptContent);

try {
    const tyres = require('./temp_tyredata.js');
    let sql = "BEGIN;\n";
    sql += "TRUNCATE TABLE tyres CASCADE;\n"; // Clean slate to avoid duplicates

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    tyres.forEach(tyre => {
        const escapeSql = (str) => {
            if (!str && str !== 0 && str !== false) return 'NULL';
            return "'" + String(str).replace(/'/g, "''") + "'";
        };
        
        const id = escapeSql(uuidv4());
        const brand = escapeSql(tyre.brand);
        const pattern = escapeSql(tyre.pattern);
        const size = escapeSql(tyre.size);
        const price = tyre.price || 0;
        const newPrice = tyre.newPrice || tyre.price || 0;
        const usedPrice = tyre.usedPrice || 'NULL';
        const originalPrice = tyre.originalPrice || 'NULL';
        const rating = tyre.rating || 'NULL';
        const reviewCount = tyre.reviewCount || 'NULL';
        const type = escapeSql(tyre.type || 'new');
        const inStock = tyre.inStock === false ? 'FALSE' : 'TRUE';
        
        let imageUrl = tyre.imageUrl || tyre.image;
        if (!imageUrl) {
            const b = tyre.brand ? tyre.brand.toLowerCase() : '';
            if (tyre.type === 'used' && ['apollo', 'ceat', 'mrf'].includes(b)) {
                imageUrl = `/used-${b}-tyre.jpg`;
            } else if (['apollo', 'bridgestone', 'ceat', 'goodyear', 'jk tyre', 'mrf', 'yokohama'].includes(b)) {
                imageUrl = `/${b.replace(/\s+/g, '-')}-car-tyre.jpg`;
            } else {
                imageUrl = '/car-tyre-new.jpg';
            }
        }
        imageUrl = escapeSql(imageUrl);
        
        const featuresArray = Array.isArray(tyre.features) ? tyre.features : [];
        const features = escapeSql(featuresArray.join(', '));
        
        const productCode = tyre.productCode ? escapeSql(tyre.productCode) : 'NULL';
        const warrantyYears = tyre.warrantyYears || 'NULL';
        
        sql += `INSERT INTO tyres (id, brand, pattern, size, price, new_price, used_price, original_price, rating, review_count, type, in_stock, image_url, features, product_code, warranty_years) VALUES (${id}, ${brand}, ${pattern}, ${size}, ${price}, ${newPrice}, ${usedPrice}, ${originalPrice}, ${rating}, ${reviewCount}, ${type}, ${inStock}, ${imageUrl}, ${features}, ${productCode}, ${warrantyYears});\n`;
    });
    
    sql += "COMMIT;\n";
    fs.writeFileSync('generated_seed.sql', sql);
    console.log("SQL generated! Importing...");
} catch (e) {
    console.error("Error parsing TS array", e);
}
