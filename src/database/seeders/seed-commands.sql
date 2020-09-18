-- Enabling pgcryto
-- https://x-team.com/blog/storing-secure-passwords-with-postgresql/
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create accounts table
CREATE TABLE accounts (
	user_id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	password CITEXT NOT NULL,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_login TIMESTAMP
);

-- Populate accounts table
INSERT INTO accounts (user_id, email, password, created_on, updated_on, last_login)
VALUES
    ('40e6215d-b5c6-4896-987c-f30f3678f608', 'pedrobelfort@gmail.com', crypt('ppass', gen_salt('bf')), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    ('6ecd8c99-4036-403d-bf84-cf8400f67836', 'sophiasiampani@yahoo.com', crypt('spass', gen_salt('bf')), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)
RETURNING *;

-- Create session table
CREATE TABLE sessions (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_account
      FOREIGN KEY(user_id)
	  REFERENCES accounts(user_id)
	  ON DELETE CASCADE
      ON UPDATE CASCADE
);

-- Create picture table
CREATE TABLE images (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source CITEXT NOT NULL
);

-- Create profile table
CREATE TABLE profiles (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL,
    fullname TEXT,
    image_id INT,
	updated_on TIMESTAMP NOT NULL,
    CONSTRAINT fk_account
      FOREIGN KEY(user_id)
	  REFERENCES accounts(user_id)
	  ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_image
      FOREIGN KEY(image_id)
	  REFERENCES images(id)
      ON DELETE SET NULL
);

-- Create category table
CREATE TABLE categories (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title CITEXT NOT NULL,
    image_id INT NOT NULL,
    CONSTRAINT fk_image
      FOREIGN KEY(image_id)
	    REFERENCES images(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create ingredients table
CREATE TABLE ingredients (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title CITEXT NOT NULL,
    image_id INT NOT NULL,
    CONSTRAINT fk_image
      FOREIGN KEY(image_id)
	    REFERENCES images(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create product (dish) table
CREATE TABLE products (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title CITEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    description CITEXT,
    preparation_time INT NOT NULL
    CONSTRAINT positive_price
        CHECK (unit_price > 0)
);

-- Create relationship between product and ingredients
CREATE TABLE product_ingredients (
    product_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    PRIMARY KEY (product_id, ingredient_id),
    CONSTRAINT fk_product
      FOREIGN KEY(product_id)
	    REFERENCES products(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_ingredient
      FOREIGN KEY(ingredient_id)
	    REFERENCES ingredients(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create relationship between product and category
CREATE TABLE product_categories (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_product
      FOREIGN KEY(product_id)
	    REFERENCES products(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_category
      FOREIGN KEY(category_id)
	    REFERENCES categories(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create relationship between product and image
CREATE TABLE product_images (
    product_id INT NOT NULL,
    image_id INT NOT NULL,
    PRIMARY KEY (product_id, image_id),
    CONSTRAINT fk_product
      FOREIGN KEY(product_id)
	    REFERENCES products(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_image
      FOREIGN KEY(image_id)
	    REFERENCES images(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create cuisines table
CREATE TABLE cuisines (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title CITEXT NOT NULL,
    image_id INT NOT NULL,
    CONSTRAINT fk_image
      FOREIGN KEY(image_id)
	    REFERENCES images(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create locations table
CREATE TABLE locations (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    city CITEXT NOT NULL
);

-- Insert random locations
INSERT INTO locations (city)
VALUES
    ('Glasgow'),
    ('Rio de Janeiro'),
    ('Edinburgh')
RETURNING *;

-- Create outlets table
CREATE TABLE outlets (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cuisine_id INT NOT NULL,
    title CITEXT NOT NULL,
    rating NUMERIC(2,1) DEFAULT 0.0,
    price_level INT NOT NULL,
    location_id INT NOT NULL,
    CONSTRAINT fk_cuisine
      FOREIGN KEY(cuisine_id)
	    REFERENCES cuisines(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_location
      FOREIGN KEY(location_id)
	    REFERENCES locations(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT price_level_limit
        CHECK (price_level < 6.0),
        CHECK (price_level > 0.0),
    CONSTRAINT rating_limit
        CHECK (rating < 6.0),
        CHECK (rating >= 0.0)
);

-- Create relationship between outlet and image
CREATE TABLE outlet_images (
    outlet_id INT NOT NULL,
    image_id INT NOT NULL,
    PRIMARY KEY (outlet_id, image_id),
    CONSTRAINT fk_outlet
      FOREIGN KEY(outlet_id)
	    REFERENCES outlets(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_image
      FOREIGN KEY(image_id)
	    REFERENCES images(id)
	    ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create relationship outlet outlet and products
CREATE TABLE outlet_products (
    outlet_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (outlet_id, product_id),
    CONSTRAINT fk_outlet
      FOREIGN KEY(outlet_id)
	  REFERENCES outlets(id)
	  ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_product
      FOREIGN KEY(product_id)
	  REFERENCES products(id)
      ON DELETE SET NULL
);

-- Create visits table (relationship between user profile and outlet)
CREATE TABLE visits (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_id INT NOT NULL,
    outlet_id INT NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT false,
    CONSTRAINT fk_account
      FOREIGN KEY(profile_id)
	  REFERENCES profiles(id)
	  ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_outlet
      FOREIGN KEY(outlet_id)
	  REFERENCES outlets(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

-- Create preparation_status enum
CREATE TYPE cart_status AS ENUM ('NOT_ORDERED', 'ORDERED');

-- Create carts table
CREATE TABLE carts (
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    session_id uuid NOT NULL,
    outlet_id INT NOT NULL,
    subtotal NUMERIC NOT NULL DEFAULT 0.0,
    status cart_status NOT NULL DEFAULT 'NOT_ORDERED',
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT subtotal_non_negative
        CHECK(subtotal >= 0),
    CONSTRAINT fk_session
        FOREIGN KEY(session_id)
            REFERENCES sessions(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_outlet
        FOREIGN KEY(outlet_id)
            REFERENCES outlets(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create preparation_status enum
CREATE TYPE preparation_status AS ENUM ('NOT_ORDERED', 'PREPARING', 'DELIVERED');

-- Create cart items table
CREATE TABLE cart_items (
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total NUMERIC NOT NULL,
    status preparation_status NOT NULL DEFAULT 'NOT_ORDERED',
    PRIMARY KEY (cart_id, product_id),
    CONSTRAINT fk_cart
        FOREIGN KEY(cart_id)
            REFERENCES carts(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
            REFERENCES products(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT quantity_non_negative
        CHECK(quantity >= 0),
    CONSTRAINT total_non_negative
        CHECK(total >= 0)
);

-- Create order_status enum
CREATE TYPE order_status AS ENUM ('OPEN', 'PAID');

-- Create orders table
CREATE TABLE orders (
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    subtotal NUMERIC NOT NULL DEFAULT 0.0,
    status order_status NOT NULL DEFAULT 'OPEN',
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT subtotal_non_negative
        CHECK(subtotal >= 0)
);

-- Create credit_card table
CREATE TABLE credit_cards (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    number NUMERIC(16) NOT NULL,
    expiry TIMESTAMP NOT NULL,
    cvv NUMERIC(3) NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    cardholder CITEXT NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert random credit_card
INSERT INTO credit_cards (number, expiry, cvv, country_code, cardholder)
VALUES
    (1111222233334444, CURRENT_TIMESTAMP, 007, 'BR', 'Amanda Baggins')
RETURNING *;

-- Create payment_method enum
CREATE TYPE payment_method_type AS ENUM ('CREDIT_CARD', 'CASH', 'APPLE_PAY', 'GOOGLE_PAY');

-- Create payment method table
CREATE TABLE payment_methods (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type payment_method_type NOT NULL,
    credit_card_id INT,
    CONSTRAINT fk_credit_card
        FOREIGN KEY(credit_card_id)
            REFERENCES credit_cards(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Insert random payment_method
INSERT INTO payment_methods (type, credit_card_id)
VALUES
    ('CREDIT_CARD', 1)
RETURNING *;

-- Create payment table
CREATE TABLE payments (
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    payment_method_id INT NOT NULL,
    session_id uuid NOT NULL,
    order_id INT NOT NULL UNIQUE,
    total NUMERIC NOT NULL DEFAULT 0.0,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session
        FOREIGN KEY(session_id)
            REFERENCES sessions(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_payment_method
        FOREIGN KEY(payment_method_id)
            REFERENCES payment_methods(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_order
        FOREIGN KEY(order_id)
            REFERENCES orders(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT total_non_negative
        CHECK(total >= 0)
);

-- Create payment_orders table
CREATE TABLE wallets (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL,
    main_payment_method_id INT NOT NULL,
    CONSTRAINT fk_account
        FOREIGN KEY(user_id)
            REFERENCES accounts(user_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_payment_method
        FOREIGN KEY(main_payment_method_id)
            REFERENCES payment_methods(id)
            ON DELETE CASCADE
			ON UPDATE CASCADE
);

-- Create wallet_payment_methods table (relationship between wallet and payment_methods)
CREATE TABLE wallet_payment_methods (
    wallet_id INT NOT NULL,
    payment_method_id INT NOT NULL,
    PRIMARY KEY (wallet_id, payment_method_id),
    CONSTRAINT fk_wallet
        FOREIGN KEY(wallet_id)
            REFERENCES wallets(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_payment_method
        FOREIGN KEY(payment_method_id)
            REFERENCES payment_methods(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create favorites table
CREATE TABLE favorites (
    profile_id INT NOT NULL,
    outlet_id INT NOT NULL,
    PRIMARY KEY (profile_id, outlet_id),
     CONSTRAINT fk_profile
        FOREIGN KEY(profile_id)
            REFERENCES profiles(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_outlet
        FOREIGN KEY(outlet_id)
            REFERENCES outlets(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create featured outlets table
CREATE TABLE featured_outlets (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    outlet_id INT NOT NULL UNIQUE,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_outlet
        FOREIGN KEY(outlet_id)
            REFERENCES outlets(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create featured outlet products table
CREATE TABLE featured_outlet_products (
    outlet_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (outlet_id, product_id),
    CONSTRAINT fk_outlet
      FOREIGN KEY(outlet_id)
	  REFERENCES outlets(id)
	  ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_product
      FOREIGN KEY(product_id)
	  REFERENCES products(id)
      ON DELETE SET NULL
);

-- Create outlet table table
CREATE TABLE outlet_table (
    number INT NOT NULL,
    outlet_id INT NOT NULL,
    occupied BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (number, outlet_id),
    CONSTRAINT fk_outlet
      FOREIGN KEY(outlet_id)
	  REFERENCES outlets(id)
	  ON DELETE CASCADE
      ON UPDATE CASCADE
);

-- Create session_carts table (relationship session and cart)
CREATE TABLE session_carts (
    session_id uuid NOT NULL,
    cart_id INT NOT NULL,
    PRIMARY KEY(session_id, cart_id),
    CONSTRAINT fk_session
        FOREIGN KEY(session_id)
            REFERENCES sessions(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_cart
        FOREIGN KEY(cart_id)
            REFERENCES carts(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create order_carts table (relationship order and cart)
CREATE TABLE order_carts (
    order_id INT NOT NULL,
    cart_id INT NOT NULL,
    PRIMARY KEY(order_id, cart_id),
    CONSTRAINT fk_order
        FOREIGN KEY(order_id)
            REFERENCES orders(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_cart
        FOREIGN KEY(cart_id)
            REFERENCES carts(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create session_orders table (relationship session and order)
CREATE TABLE session_orders (
    session_id uuid NOT NULL,
    order_id INT NOT NULL,
    PRIMARY KEY(session_id, order_id),
    CONSTRAINT fk_session
        FOREIGN KEY(session_id)
            REFERENCES sessions(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_order
        FOREIGN KEY(order_id)
            REFERENCES orders(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Mock data --


-- Insert images
INSERT INTO images (source)
VALUES
-- CORO The Chocolate Café
    -- Outlet pictures
    -- 1
 ('https://i2.wp.com/www.corochocolate.co.uk/wp-content/uploads/2019/03/coro_crepe.jpg?fit=560%2C800'),
    -- 2
 ('https://i2.wp.com/www.corochocolate.co.uk/wp-content/uploads/2019/03/Coro_cake.jpg?fit=560%2C800'),
    -- 3
 ('https://i0.wp.com/www.corochocolate.co.uk/wp-content/uploads/2019/03/Coro_hotchoc.jpg?fit=560%2C800'),
    -- Product pictures
    -- 4
 ('https://i1.wp.com/www.corochocolate.co.uk/wp-content/uploads/2019/12/CaramelShortbreadBubbleWaffle.jpg?fit=560%2C800'),
    -- 5
 ('https://i1.wp.com/www.corochocolate.co.uk/wp-content/uploads/2019/12/berryblissbubblewaffle.jpg?fit=560%2C800'),
    -- 6
 ('https://i2.wp.com/www.corochocolate.co.uk/wp-content/uploads/2020/01/maltesercheesecake.jpg?fit=560%2C800'),
    -- 7
 ('https://i2.wp.com/www.corochocolate.co.uk/wp-content/uploads/2020/01/brownie.jpg?fit=560%2C800'),
    -- 8
 ('https://i2.wp.com/www.corochocolate.co.uk/wp-content/uploads/2019/03/Mint-Choc-Shake-straw.jpg?fit=560%2C800'),
-- Las Iguanas
    -- Outlet pictures
    -- 9
 ('https://images.ctfassets.net/6qprbsfbbvrl/55ruz0Vkw3fYNqWpWHC9iN/316f44e01db07e88ace1af0242147bd4/Group_Tapas_Blog.jpg'),
    -- 10
 ('https://images.ctfassets.net/6qprbsfbbvrl/14RYPfimFc6iwPZlqbTCu0/bbc6b28da07e7b46835e8b8b1d7e31de/Delivery_Hero.jpg'),
    -- 11
 ('https://images.ctfassets.net/6qprbsfbbvrl/3z4seOUkUzxqYmL8xWcO34/f72c95a87f37b6ed5a51177eb728342a/Passion_Fruit_Zombie.jpg'),
    --  Product pictures
    -- 12
 ('https://images.ctfassets.net/6qprbsfbbvrl/3XvqZjVfPD6FDMuxOECcGA/8b4d98241e88c52a4d70f51383bfb96d/Nachos.jpg'),
    -- 13
 ('https://images.ctfassets.net/6qprbsfbbvrl/AlTWIBwo3zwOi3dwmcNei/f11747c3f6b27c3410aa1b45ad2ea531/Halloumi_Skewers.jpg'),
    -- 14
 ('https://images.ctfassets.net/6qprbsfbbvrl/ixvPEaRtlO7WNMBMtYpoH/8147c92fae5e5237fef9072ff4a37c56/Copacabana_Burger.jpg'),
    -- 15
 ('https://images.ctfassets.net/6qprbsfbbvrl/3T0rllkqoz0QmbGMi4IllS/f92443af302b7cce78d86831a91a1c10/Caipirinha.jpg'),
    -- 16
 ('https://images.ctfassets.net/6qprbsfbbvrl/7ghCj7hKkwAOMWB7HI7RT2/508b01e72473463f9cc89d514391e27e/Margarita.jpg'),
-- Smashburger
    -- Outlet pictures
    -- 17
 ('http://smashburger.co.uk/wp-content/uploads/2017/10/exclusive-offers.jpg'),
    -- 18
 ('https://smashburger.com/wp-content/uploads/2019/04/classicsmashmeal.jpg'),
    -- 19
 ('https://smashburger.com/wp-content/uploads/2020/02/fries.jpg'),
    --  Product pictures
    -- 20
 ('https://smashburger.com/wp-content/uploads/2019/04/Beef_Single_Classic-Smash_511x384_106_0419.png'),
    -- 21
 ('https://smashburger.com/wp-content/uploads/2019/04/Beef_Single_Bacon-Smash_511x384_126_0419.png'),
    -- 22
 ('https://smashburger.com/wp-content/uploads/2019/04/Beef_Single_Avocado-Bacon-Club_511x384_247_0419.png'),
    -- 23
 ('https://smashburger.com/wp-content/uploads/2018/06/Sides_Smashfries_511x384_23041.png'),
    -- 24
 ('https://smashburger.com/wp-content/uploads/2019/04/Salad_BBQ-Ranch_511x384_628_0419.png'),
-- La Vita Sputini
    -- Outlet pictures
    -- 25
 ('https://5pm-images.imgix.net/offerproviders/none/offerproviderpics/b200f275241140319b09ab8dbfea41dd.jpg?h=560&fit=crop&crop=entropy&auto=format,compress&q=60&max-w=800'),
    -- 26
 ('https://5pm-images.imgix.net/offerproviders/none/offerproviderpics/4f7df7ce8d4e4723824a5ced1b7158fa.jpg?h=560&fit=crop&crop=entropy&auto=format,compress&q=60&max-w=800'),
    -- 27
 ('https://5pm-images.imgix.net/offerproviders/none/offerproviderpics/b200f275241140319b09ab8dbfea41dd.jpg?h=560&fit=crop&crop=entropy&auto=format,compress&q=60&max-w=800'),
    --  Product pictures
    -- 28
 ('https://pt.italianissimobr.com.br/images/site/curiosidades/bruschetta/it_bruschetta.jpg'),
    -- 29
 ('https://www.kitchensanctuary.com/wp-content/uploads/2019/09/Spaghetti-Bolognese-square-FS-0204.jpg'),
    -- 30
 ('https://s2.glbimg.com/fkFkU2MIOher_0qhzAqTHGBeFhE=/0x0:507x338/984x0/smart/filters:strip_icc()/s2.glbimg.com/Kpgvs3M5-Ve_6wYzVDA10f4ixs0%3D/s.glbimg.com/et/gs/f/original/2016/11/18/carbonara_gshow.jpg'),
    -- 31
 ('https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2Farchive%2F2832f13af92f5bcf3ef860796044d2355e770c03'),
    -- 32
 ('https://pizzariadesucesso.com/wp-content/uploads/2018/05/pepperoni-pizza.jpg'),
-- Bar Soba
    -- Outlet pictures
   -- 33
 ('https://www.barsoba.co.uk/datafiles/uploaded/cmsRefImage/biz_location/additional/main/main_22_Byres%20rd%202.jpg'),
   -- 34
 ('https://www.barsoba.co.uk/datafiles/uploaded/cmsRefImage/biz_location/additional/small/small_21_Byres%20rd%203.jpg'),
   -- 35
 ('https://www.barsoba.co.uk/datafiles/uploaded/cmsRefImage/biz_location/additional/small/small_20_Byres%20rd%207.jpg'),
    --  Product pictures
   -- 36
 ('https://realhousemoms.com/wp-content/uploads/One-Pot-Pad-Thai-IG.jpg'),
   -- 37
 ('https://images.ctfassets.net/qu53tdnhexvd/2kcL0QUsAnG4ST7Y4wSDoh/489944e578f4696c926902d034181282/chicken-katsu-curry-with-pickle.jpg'),
   -- 38
 ('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTOAdpchPiA4oZid3SbNYSFRfpubwJik7zjhg&usqp=CAU'),
   -- 39
 ('https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/4/30/0/FNK_Grilled-Thai-Curry-Beef-Roll_s4x3.jpg.rend.hgtvcom.826.620.suffix/1525105613903.jpeg'),
   -- 40
 ('https://www.kitchensanctuary.com/wp-content/uploads/2018/01/Crispy-Chilli-Beef-Noodles-recipe-square-FS.jpg'),
-- CUISINES
  -- 41
 ('https://www.expatica.com/app/uploads/sites/5/2014/05/French-food2400x1600px.jpg'),
  -- 42
 ('https://www.visitbrazil.net/wp-content/uploads/2020/01/Brazilian-Food.jpg'),
  -- 43
 ('https://media-cdn.tripadvisor.com/media/photo-s/13/5d/e7/8c/getlstd-property-photo.jpg'),
  -- 44
 ('https://media-cdn.tripadvisor.com/media/photo-s/19/ee/58/51/italian-feast.jpg'),
  -- 45
 ('https://asianinspirations.com.au/wp-content/uploads/2020/02/01_SouthtoNorth_1920x1280.jpg'),
-- INGREDIENTS
  -- 46 | Chocolate
  ('https://vaya.in/recipes/wp-content/uploads/2018/02/Milk-Chocolate-1.jpg'),
  -- 47 | Milk
  ('https://5.imimg.com/data5/HL/RC/AU/SELLER-46798719/milk-bottle-500x500.jpg'),
  -- 48 | Eggs
  ('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQR_ujuCJg2L11JedO8pmmSL-7R7cfIaaKFXw&usqp=CAU'),
  -- 49 | Flour
  ('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQr08_fIMrHUdGv4m_CVHcfsptlce-tYKiAyQ&usqp=CAU'),
  -- 50 | Berries
  ('https://media.istockphoto.com/photos/sweet-berries-mix-picture-id859674796?k=6&m=859674796&s=612x612&w=0&h=b5jlttOCGwboteE7qgO7pHgI4nNehxOH6kW__glVBIw='),
  -- 51 | Mint
  ('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTSME-zep42wLAzrusRKyP4umM-Rb-E7oG9tg&usqp=CAU'),
  -- 52 | Beef
  ('https://embed.widencdn.net/img/beef/ykx2udurwn/800x600px/7-Bone%20Chuck%20Steak.psd?keep=c&u=7fueml'),
  -- 53 | Chicken
  ('https://images.eatthismuch.com/site_media/img/451_erin_m_d7cfcfcd-642a-4d6b-b6e8-0adf3eabbff7.png'),
  -- 54 | Bacon
  ('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSQWKzb3oADHX3ShfcRqKIDn-GrBU4l3NBB1Q&usqp=CAU'),
  -- 55 | Lettuce
  ('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRKP-B48UGMfKX-k11i7QifH_JoEtGpWbAKqQ&usqp=CAU'),
  -- 56 | Tomato
  ('https://www.fresh-square.com/wp-content/uploads/2016/10/Cherry-Tomato.jpg'),
  -- 57 | Cheese
  ('https://i.dlpng.com/static/png/5480490-amul-cheese-slices-200-gm-amul-cheese-slice-100g-png-image-cheese-slice-png-300_202_preview.png'),
  -- 58 | Pasta
  ('https://www.appinc.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/1/0/10493-1.jpg')
RETURNING *;

-- Insert cuisines
INSERT INTO cuisines (title, image_id)
VALUES
    ('French', 41),
    ('Brazilian', 42),
    ('American', 43),
    ('Italian', 44),
    ('Asian', 45)
RETURNING *;

-- Insert outlets
INSERT INTO outlets (cuisine_id, title, rating, price_level, location_id)
VALUES
    (1, 'CORO The Chocolate Café', 4.5, 2, 1),
    (2, 'Las Iguanas', 4.5, 3, 1),
    (3, 'Smashburger', 4.0, 2, 1),
    (4, 'La Vita Spuntini', 4.0, 3, 1),
    (5, 'Bar Soba', 3.5, 3, 1)
RETURNING *;

-- Insert products
INSERT INTO products (title, unit_price, description, preparation_time)
VALUES
    -- Coro products
    -- 1
    ('Caramel & Shortbread Bubble Wafflegne', 7.99, 'Freshly made bubble waffle topped with melted Belgian milk chocolate, crushed shortbread, caramel sauce & salted caramel ice cream', 10),
    ('Berry Bliss Bubble Waffle', 7.99, 'Freshly made bubble waffle topped with melted Belgian white chocolate, Strawberries, raspberries, blueberries, Raspberry coulis, Strawberry ice cream & whipped cream.', 15),
    ('Malteaser Cheesecake', 4.95, 'A home favourite chocolate treat combined into a cheesecake. This chocolate cheesecake will have you coming back for more and more. Served with a pot of chocolate.', 10),
    ('Brownie', 3.50, 'Two triangles of gluten free brownie topped with a Belgian milk chocolate drizzle. Can be served warm if requested', 10),
    ('Mint Chocolate Shake', 4.95, 'White chocolate, mint chocolate ice cream & dark chocolate chips. Served in our signature milk bottle', 10),
    -- Las Iguanas
    -- 6
    ('Nachos', 8.25, 'Corn tortilla chips with melted cheese, topped with pico de gallo salsa, jalapeños, roasted tomato salsa, sour cream & guacamole. Also available with vegan cheese', 20),
    ('Brazilian Beach Cheese', 5.75, 'Salty, squeaky cheese pan-fried & served with oregano & sticky chilli jam', 20),
    ('Copacabana Burger', 12.50, 'Buttermilk-marinated chicken breast in a crisp spice-crumb with Emmental, pink pickled onions, beef tomato, lettuce, fresh coriander, amarillo aioli & tomato-gherkin mayo in a toasted brioche bun. Served with a choice of fries or salad', 25),
    ('Caipirinha', 4.50, 'Our award-winning signature cocktail; Las Iguanas Magnifica Cachaça, lime, sugar', 10),
    ('The Margarita', 6.50, 'Olmeca Altos Blanco 100% Agave Tequila, triple sec, lime, salt', 10),
    -- Smashburger
    -- 11
    ('Classic Smash', 9.95, 'Served with lettuce, tomato, onion & pickles. 100% Certified Angus Beef® & Black Bean burgers include American cheese, Smash Sauce & ketchup on a classic bun', 20),
    ('Bacon Smash', 10.50, 'Applewood smoked bacon, American cheese, lettuce, tomato & mayo on a classic bun', 20),
    ('Bacon Avocado Club', 10.95, 'With lettuce, tomato, ranch dressing & mayo on a multi-grain bun', 25),
    ('Smashfries', 3.25, 'Tossed in rosemary, garlic & olive oil', 10),
    ('BBQ Ranch Salad', 5.95, 'Fresh greens, sharp cheddar, applewood smoked bacon, tomatoes & haystack onions with ranch dressing & BBQ sauce', 10),
    -- La Vita Spuntini
    -- 16
    ('Bruschetta Pomodoro', 9.99, 'Toasted bread topped with a mix of chopped tomato, garlic and extra virgin olive oil', 10),
    ('Spaghetti Bolognese', 7.95, 'The traditional Italian meat and tomato sauce as Mamma would make', 20),
    ('Spaghetti Carbonara', 12.95, 'A classic cream and herb sauce with strips of succulent bacon', 25),
    ('Lasagne', 8.50, 'Lasagne are a type of wide, flat pasta, possibly one of the oldest types of pasta. Lasagne, or the singular lasagna, is also an Italian dish made of stacked layers of this flat pasta alternating with fillings such as ragù and other vegetables, cheese, and seasonings and spices such as garlic, oregano and basil', 30),
    ('Pizza Pepperoni', 8.0, 'A thin crust pizza base topped with tomato and mozzarella cheese and pepperoni', 30),
    -- Bar Soba
    -- 21
    ('Pad Thai Noodles', 13.00, 'Classic thai street food dish with rice noodles & roasted peanuts', 15),
    ('Katsu Curry', 11.00, 'Crispy buttermilk friend chicken with jasmine rice & katsu sauce', 20),
    ('Bangkok beef burger', 11.0, 'Premium beef burger infused with curry, garlic, chilli & ginger topped with cheese, rainbow slaw, crispy noodles & soba mayo. Served on a brioche bun with thai fries & sweet chilli sauce', 12),
    ('Japanese beef rolls', 8.50, 'Fresh, slightly spiced veg with garlic & ginger served on a crispy wonton', 15),
    ('Shredded beef noodles', 8.00, 'Wok fried egg noodles with seared steak & asian vegetables. In a sticky, spicy szechuan glaze', 20)
RETURNING *;

-- Insert categories
INSERT INTO categories (title, image_id)
VALUES
    -- 1
    ('Waffles', 1),
    -- 2
    ('Cakes', 1),
    -- 3
    ('Milk Shakes', 1),
    -- 4
    ('Tapas and starters', 1),
    -- 5
    ('Mains', 1),
    -- 6
    ('Drinks', 1),
    -- 7
    ('Burgers', 1),
    -- 8
    ('Sides', 1),
    -- 9
    ('Salads', 1),
    -- 10
    ('Starters', 1),
    -- 11
    ('Pizzas', 1),
    -- 12
    ('Noodles', 1),
    -- 13
    ('Rices', 1),
    -- 14
    ('Rolls', 1)
RETURNING *;

-- Insert ingredients
INSERT INTO ingredients (title, image_id)
VALUES
    -- 1
    ('Chocolate', 46),
    -- 2
    ('Milk', 47),
    -- 3
    ('Eggs', 48),
    -- 4
    ('Flour', 49),
    -- 5
    ('Berries', 50),
    -- 6
    ('Mint', 51),
    -- 7
    ('Beef', 52),
    -- 8
    ('Chicken', 53),
    -- 9
    ('Bacon', 54),
    -- 10
    ('Lettuce', 55),
    -- 11
    ('Tomatoes', 56),
    -- 12
    ('Cheese', 57),
    -- 13
    ('Pasta', 58)
RETURNING *;

-- ASSOCIATIONS

-- Link some outlets to images
INSERT INTO outlet_images (outlet_id, image_id)
VALUES
-- CORO
    (1, 1),
    (1, 2),
    (1, 3),
-- IGUANAS
    (2, 9),
    (2, 10),
    (2, 11),
-- SMASH
    (3, 17),
    (3, 18),
    (3, 19),
-- SPUTINI
    (4, 25),
    (4, 26),
    (4, 27),
-- SOBA
    (5, 33),
    (5, 34),
    (5, 35)
RETURNING *;

-- Link some products to images
INSERT INTO product_images (product_id, image_id)
VALUES
-- CORO
    (1, 4),
    (2, 5),
    (3, 6),
    (4, 7),
    (5, 8),
-- IGUANAS
    (6, 12),
    (7, 13),
    (8, 14),
    (9, 15),
    (10, 16),
-- SMASH
    (11, 20),
    (12, 21),
    (13, 22),
    (14, 23),
    (15, 24),
-- SPUTINI
    (16, 28),
    (17, 29),
    (18, 30),
    (19, 31),
    (20, 32),
-- SOBA
    (21, 36),
    (22, 37),
    (23, 38),
    (24, 39),
    (25, 40)
RETURNING *;

-- Link some products to ingredients
INSERT INTO product_ingredients (product_id, ingredient_id)
VALUES
-- CORO
    -- Caramel
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    -- Berry
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 4),
    (2, 5),
    -- Cheesecake
    (3, 1),
    (3, 2),
    (3, 3),
    -- Brownie
    (4, 1),
    (4, 4),
    -- Milkshake
    (5, 1),
    (5, 2),
    (5, 6),
-- IGUANAS
    -- Nachos
    (6, 11),
    (6, 12),
    -- Brazilian Beach Cheese
    (7, 12),
    -- Copa Burger
    (8, 8),
    (8, 10),
    (8, 11),
    -- Cachaça
    (9, 6),
    -- Margarita
    (10, 6),
-- SMASH
    -- Classic
    (11, 7),
    (11, 10),
    (11, 11),
    (11, 12),
    -- Bacon
    (12, 7),
    (12, 9),
    (12, 10),
    (12, 11),
    -- Bacon Avocado
    (13, 7),
    (13, 9),
    (13, 10),
    (13, 11),
    -- Fries
    (14, 12),
    -- Ranch Salad
    (15, 9),
    (15, 10),
    (15, 11),
-- SPUTINI
    -- Bruscheta
    (16, 11),
    -- Bolongese
    (17, 7),
    (17, 11),
    (17, 13),
    -- Carbonara
    (18, 9),
    (18, 13),
    -- Lasange
    (19, 13),
    (19, 11),
    (19, 12),
    (19, 7),
    -- Pizza
    (20, 12),
    (20, 11),
-- SOBA
    -- Pad Thai
    (21, 13),
    -- Curry
    (22, 8),
    (22, 13),
    -- Beef burger
    (23, 7),
    (23, 12),
    (23, 13),
    -- Japanese beef
    (24, 7),
    -- Beef noodles
    (25, 7),
    (25, 3),
    (25, 13)
RETURNING *;

-- Link some products to categories
INSERT INTO product_categories (product_id, category_id)
VALUES
-- CORO
    -- Caramel
    (1, 1),
    -- Berry
    (2, 1),
    -- Cheesecake
    (3, 2),
    -- Brownie
    (4, 2),
    -- Milkshake
    (5, 3),
-- IGUANAS
    -- Nachos
    (6, 4),
    -- Brazilian Beach Cheese
    (7, 4),
    -- Copa Burger
    (8, 5),
    -- Cachaça
    (9, 6),
    -- Margarita
    (10, 6),
-- SMASH
    -- Classic
    (11, 7),
    -- Bacon
    (12, 7),
    -- Bacon Avocado
    (13, 7),
    -- Fries
    (14, 8),
    -- Ranch Salad
    (15, 9),
-- SPUTINI
    -- Bruscheta
    (16, 10),
    -- Bolongese
    (17, 5),
    -- Carbonara
    (18, 5),
    -- Lasange
    (19, 5),
    -- Pizza
    (20, 11),
-- SOBA
    -- Pad Thai
    (21, 12),
    -- Curry
    (22, 13),
    -- Beef burger
    (23, 7),
    -- Japanese beef
    (24, 14),
    -- Beef noodles
    (25, 12)
RETURNING *;

-- Link outlets to products
INSERT INTO outlet_products (outlet_id, product_id)
VALUES
-- CORO
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
-- IGUANAS
    (2, 6),
    (2, 7),
    (2, 8),
    (2, 9),
    (2, 10),
-- SMASH
    (3, 11),
    (3, 12),
    (3, 13),
    (3, 14),
    (3, 15),
-- SPUTINI
    (4, 16),
    (4, 17),
    (4, 18),
    (4, 19),
    (4, 20),
-- SOBA
    (5, 21),
    (5, 22),
    (5, 23),
    (5, 24),
    (5, 25)
RETURNING *;

-- Add outlets to the featured tanble
INSERT INTO featured_outlets (outlet_id)
VALUES
    (1),
    (2),
    (4),
    (5)
RETURNING *;

-- Add featured outlet products
INSERT INTO featured_outlet_products (outlet_id, product_id)
VALUES
-- CORO
    (1, 1),
    (1, 2),
    (1, 3),
-- IGUANAS
    (2, 7),
    (2, 8),
-- SMASH
    (3, 11),
    (3, 12),
    (3, 14),
    (3, 15),
-- SPUTINI
    (4, 17),
    (4, 18),
    (4, 20),
-- SOBA
    (5, 22),
    (5, 23),
    (5, 25)
RETURNING *;

-- RANDOM DATA

-- Insert random profiles
INSERT INTO profiles (user_id, fullname, image_id, updated_on)
VALUES
    ('40e6215d-b5c6-4896-987c-f30f3678f608', 'Pedro Belfort', 1, CURRENT_TIMESTAMP),
    ('6ecd8c99-4036-403d-bf84-cf8400f67836','Maria Baggins', 2, CURRENT_TIMESTAMP)
RETURNING *;

-- Insert random visits
INSERT INTO visits (profile_id, outlet_id, created_on, updated_on, active)
VALUES
    (1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
    (2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)
RETURNING *;
