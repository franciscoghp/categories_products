const { response } = require('express');
let categories = [];

const getAllCategories = async(req, res = response ) => {
    const nombre  = req.query.nombre;
    if( nombre ) return getCategory(nombre, res )
    res.json({
        total: categories?.length,
        categories
    });
}

const getCategory = ( nombre, res ) => {
    const category = categories.find( item => item.nombre_categoria == nombre )
    if( !category ) return res.json( {message: "Category not found"} );
    res.json( category );
}

const getCategoryById = async(req, res = response ) => {
    const { id } = req.params;
    const category = categories.find( item => item.id == id )
    if( !category ) return res.json( {message: "Category not found"} );
    res.json( category );
}

const postCategory = async(req, res = response ) => {

    const nombre_corto = req.body.nombre_corto.toUpperCase();
    const nombre_categoria = req.body.nombre_categoria;
    const descripcion = req.body.descripcion;

    const category = categories.find( item => item.nombre_corto == nombre_corto );

    if ( category ) {
        return res.status(400).json({
            msg: `The Category ${ category.nombre_corto }, already exists`
        });
    }

    if( nombre_corto.length > 5 ){
        return res.status(400).json({
            msg: `The short name must has at least 5 digits`
        });
    }
    // Generar la data a guardar
    const data = {
        id: categories.length + 1,
        nombre_corto,
        nombre_categoria,
        descripcion,
    }

    categories.push(data);

    res.status(201).json({
        message: "Created Successfully",
        data
    });

}

const putCategory = async( req, res = response ) => {
    const { id } = req.params;
    const category = categories.find( item => item.id == id )
    
    if( !category ) return res.json({
        message: "Category does not exist",
    });

    const { ...data } = req.body;
    for (const item in data) {
        if( !!item ) category[item] = data[item];
        if( !!category['nombre_corto'] ) category['nombre_corto'] = category['nombre_corto'].toUpperCase();
    }

    res.json({
        message: "Updated Successfully",
        category
    });

}

const deleteCategory = async(req, res =response ) => {

    const { id } = req.params;
    const category = categories.find( item => item.id == id )
    console.log('category', category)
    if( !category ) return res.json({
        message: "Category does not exist",
    });
    categories = categories.filter( item => item.id != id );
    console.log('categories', categories)

    res.json({
        message: "Category Deleted",
        categories
    });
}

module.exports = {
    postCategory,
    getAllCategories,
    getCategory,
    putCategory,
    deleteCategory,
    getCategoryById,
    categories
}