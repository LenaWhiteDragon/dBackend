import { Injectable, NotFoundException } from '@nestjs/common';
import pool from 'src/db';

@Injectable()
export class ProductService {
  // constructor(private jwtService: JwtService) {}

  async getProduct(filter) {
    // return [{id: 1, name: "комп леново"}, {id: 2, name: "мышка элджи"}, {id: 3, name: "монитор асер"}]
    const products = await pool.query(
      "SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%" + filter + "%')",
    );
    if (products.rows.length === 0)
      throw new NotFoundException('Оборудование не найдено');
    //const token = jwtTokens(users.rows[0]);
    // return users.rows[0];
    // const token = jwtTokens(users.rows[0]);
    // console.log(token);
    const products_new = products.rows;
    return products_new;
    //console.log(token);
    // return res.json({ token: `Bearer ${token}` });
  }

  async getProductById(id) {
    // return [{id: 1, name: "комп леново"}, {id: 2, name: "мышка элджи"}, {id: 3, name: "монитор асер"}]
    const products =
      await pool.query(`SELECT products.id_product, products.name, products.photo, products.number, 
       products.id_category,categories.name as c_name,atts.id_att, atts.name as a_name,atts.type,atts_of_products.var_integer,
       atts_of_products.var_boolean,atts_of_products.var_real FROM products JOIN atts_of_products 
       ON products.id_product = atts_of_products.id_product AND products.id_product =${id} 
       JOIN atts ON atts_of_products.id_att = atts.id_att JOIN categories ON products.id_category = categories.id_category`);
    if (products.rows.length === 0)
      throw new NotFoundException('Оборудование не найдено');
    const products_new = products.rows;
    const attributes = products.rows.map((attr) => ({
      id: attr.id_att,
      name: attr.a_name,
      type: attr.type,
      var_integer: attr.var_integer,
      var_boolean: attr.var_boolean,
      var_real: attr.var_real,
    }));
    const productObject = {
      id: products_new[0].id_product,
      name: products_new[0].name,
      photo: products_new[0].photo,
      number: products_new[0].number,
      category: {
        id: products_new[0].id_category,
        name: products_new[0].c_name,
      },
      atts: attributes,
    };
    console.log(productObject);
    return productObject;
  }

  async getProductByCategories(id, filter) {
    //return [{id: 1, name: "Mikhail"}, {id: 2, name: "nicolai"}, {id: 3, name: "ffff"}]
    const products = await pool.query(
      "SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%" +
        filter +
        "%') AND id_category =" +
        id +
        ')',
    );

    // const clinics = await pool.query("Select * From policlinics Where id_policlinics in (select policlinic_id from policlinic_products where products_id =" + filter + ")")
    if (products.rows.length === 0)
      throw new NotFoundException('Оборудование не найдено.');
    //const token = jwtTokens(users.rows[0]);
    // return users.rows[0];
    // const token = jwtTokens(users.rows[0]);
    // console.log(token);
    const products_new = products.rows;
    return products_new;
    //console.log(token);
    // return res.json({ token: `Bearer ${token}` });
  }
}

/*
    async createUser(email: string, password: string): Promise<Partial<users>> {
      const hashedPassword = bcrypt.hashSync(password, 12);
      return await this.userService.users.create({
        data: {
          uid: uuid4(),
          email: email,
          password: hashedPassword,
        },
        select: {
          uid: true,
          email: true,
          nickname: true,
        },
      });
    }
    */
