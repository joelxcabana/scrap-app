exports.searchQuestion = [
    {
      type: 'input',
      name: 'search',
      message: 'Buscar productos, marcas y mas... : ',
      validate(value) {
        if (value) {
          return true;
        }
  
        return 'Necesita ingresar una descripcion';
      }
    },
    {
      type: 'checkbox',
      name: 'ecommerce',
      message: 'Selecciona la fuente web : ',
      choices: [
        {value:'ML',name:'Mercado Libre',checked:false},
        {value:'FR',name:'Fravega',checked:false},
        {value:'CG',name:'Compra Gamer',checked:false},
      ]
    }
  ]
  