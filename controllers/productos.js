const { response } = require('express');
const { categories } = require('./categorias');
const { convertArrayToCSV } = require('convert-array-to-csv');
var fs = require('fs');
let products = [];

const getAllProducts = async(req, res = response ) => {
    const  nombre   = req.query.nombre;

    if( nombre ) return getProduct(nombre, res )
    res.json({
        total: products?.length,
        products
    });
}

const getCSV = async(req, res = response ) => {

    // nombre_corto_categoria
    // nombre_categoria
    // descripcion_categoria

    products = products.filter( item =>{
        delete item.id
        item['descripcion_producto'] = item['descripcion'];
        delete item.descripcion
        categories.filter( iCat =>{
            if( iCat.id == item.categoria ){
                item['nombre_corto_categoria'] = iCat.nombre_corto;
                item['nombre_categoria'] = iCat.nombre_categoria;
                item['descripcion_categoria'] = iCat.descripcion;
                delete item.categoria
            }
        })
        return item
    })
console.log('prodcuts', products)

const csvFromArrayOfObjects = convertArrayToCSV(products);
 
fs.writeFile('products.csv', csvFromArrayOfObjects, 'utf8', (err) => {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else {
        console.log('It\'s saved!');
    }
  });
return res.json({
    csvFromArrayOfObjects
})
}

const getProduct = ( nombre, res ) => {
    const product = products.find( item => item.nombre_producto == nombre )
    if( !product ) return res.json( {message: "Product not found"} );
    res.json( product );
}

const getProductById = async(req, res = response ) => {
    const { id } = req.params;
    const product = products.find( item => item.id == id )
    if( !product ) return res.json( {message: "Product not found"} );
    res.json( product );
}

const postProduct = async(req, res = response ) => {
    let sku = req.body.sku.toUpperCase();
    const {
        nombre_producto,
        descripcion,
        precio,
        categoria,
    } = req.body;

    const product = products.find( item => item.sku == sku );

    if ( product ) {
        return res.status(400).json({
            msg: `The Product ${ product.sku }, already exists`
        });
    }

    if( sku.length > 5 ){
        return res.status(400).json({
            msg: `The sku must has at least 5 digits`
        });
    }
    
    const category = categories.find( item => item.id == categoria );

    if( !category ) return res.json( {message: "Category not found"} );

    // Generar la data a guardar
    const data = {
        id: products.length + 1,
        sku,
        nombre_producto,
        descripcion,
        precio,
        categoria,
    }

    products.push(data);

    res.status(201).json({
        message: "Created Successfully",
        data
    });
}

const putProduct = async( req, res = response ) => {
    const { id } = req.params;
    const product = products.find( item => item.id == id )
    
    if( !product ) return res.json({
        message: "Product does not exist",
    });

    const { ...data } = req.body;
    for (const item in data) {
        if( !!item ) {
            console.log('item', item)
            product[item] = data[item]
            if( !!product['sku'] ) product['sku'] = product['sku'].toUpperCase();
        }
    }

    res.json({
        message: "Updated Successfully",
        product
    });
}

const deleteProduct = async(req, res = response ) => {

    const { id } = req.params;
    const product = products.find( item => item.id == id )
    
    if( !product ) return res.json({
        message: "Product does not exist",
    });
    products = products.filter( item => item.id != id );

    res.json({
        message: "Product Deleted",
        products
    });
}

module.exports = {
    postProduct,
    getAllProducts,
    getProduct,
    putProduct,
    deleteProduct,
    getProductById,
    getCSV
}