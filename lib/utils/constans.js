const ECOMMERCES = {
    'ML':'https://listado.mercadolibre.com.ar/',
    'FR':'https://www.fravega.com/l/?keyword=',
    'CG':'https://compragamer.com/?seccion=3&criterio='
}

const COLUMNS = [
    {header :'Nombre',key:'name', width: 70 },
    {header :'Precio',key:'price'},
    {header :'Url',key:'url',width: 50 },
    {header :'Imagen',key:'image',width: 50}
]

module.exports = {
    ECOMMERCES,
    COLUMNS
}