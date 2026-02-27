import re
import uuid

with open('frontend/web/lib/tyre-data.ts', 'r') as f:
    content = f.read()

match = re.search(r'export const tyreData: Tyre\[\] = \[([\s\S]*)\n\]', content)
if not match:
    exit(1)

array_content = match.group(1)
# Split strictly by `},` then clean up whitespace
objects_raw = re.split(r'\},', array_content)

sql = "BEGIN;\n"
sql += "TRUNCATE TABLE tyres CASCADE;\n"

for obj_raw in objects_raw:
    if not obj_raw.strip(): continue
    obj_raw = obj_raw.strip().strip('{').strip('}')
    
    # Extract fields using regex
    def get_val(key, default='NULL', is_string=False, is_bool=False, is_array=False):
        m = re.search(rf'{key}:\s*(.*?)(?:,|$)', obj_raw)
        if not m: return default
        val = m.group(1).strip()
        if is_string:
            val = val.strip('"').strip("'")
            return f"'{val}'"
        if is_bool:
            return 'TRUE' if val == 'true' else 'FALSE'
        if is_array:
            val = val.strip('[').strip(']')
            items = [x.strip().strip('"').strip("'") for x in val.split(',')]
            clean_val = ", ".join([x for x in items if x])
            if clean_val: return f"'{clean_val}'"
            return "NULL"
        return val

    id_val = f"'{str(uuid.uuid4())}'"
    brand = get_val('brand', is_string=True)
    if brand == 'NULL': continue # Skip empty/malformed trailing splits
    
    pattern = get_val('pattern', is_string=True)
    size = get_val('size', is_string=True)
    price = get_val('price', default='0')
    new_price = get_val('newPrice', default=price)
    used_price = get_val('usedPrice', default='NULL')
    original_price = get_val('originalPrice', default='NULL')
    rating = get_val('rating', default='NULL')
    review_count = get_val('reviewCount', default='NULL')
    type_val = get_val('type', default="'new'", is_string=True)
    in_stock = get_val('inStock', default='TRUE', is_bool=True)
    features = get_val('features', is_array=True)
    product_code = get_val('productCode', is_string=True)
    warranty_years = get_val('warrantyYears', default='NULL')

    image_url = get_val('imageUrl', is_string=True)
    if image_url == 'NULL' or not image_url:
        b = brand.strip("'").lower()
        t = type_val.strip("'").lower()
        if t == 'used' and b in ['apollo', 'ceat', 'mrf']:
            image_url = f"'/used-{b}-tyre.jpg'"
        elif b in ['apollo', 'bridgestone', 'ceat', 'goodyear', 'jk tyre', 'mrf', 'yokohama']:
            b_slug = b.replace(' ', '-')
            image_url = f"'/{b_slug}-car-tyre.jpg'"
        else:
            image_url = "'/car-tyre-new.jpg'"
            
    sql += f"INSERT INTO tyres (id, brand, pattern, size, price, new_price, used_price, original_price, rating, review_count, type, in_stock, image_url, features, product_code, warranty_years) " \
           f"VALUES ({id_val}, {brand}, {pattern}, {size}, {price}, {new_price}, {used_price}, {original_price}, {rating}, {review_count}, {type_val}, {in_stock}, {image_url}, {features}, {product_code}, {warranty_years});\n"

sql += "COMMIT;\n"

with open('generated_seed.sql', 'w') as f:
    f.write(sql)
print("SQL success")
