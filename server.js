const puppeteer = require('puppeteer')
const ExcelJS = require('exceljs')
const randomUseragent = require('random-useragent')

const initialization = async() => {

   //crear useragebt solo de firefox
   const header = randomUseragent.getRandom((ua) =>{
       return ua.browserName === 'Firefox'
   })

   //abrir el navegador sin interfaz
   const browser = await puppeteer.launch()
   //crear pestania
   const page = await browser.newPage()
   //usar el useagent
   await page.setUserAgent(header)
   //simula que estoy en una pantalla grande, para que sepa que es una computadora
   await page.setViewport({width:1920,height:1080})

   await page.goto('https://listado.mercadolibre.com.ar/placa-de-video#D[A:placa%20de%20video]')
   
   //buscar por clase (.) id (#) sin nada es elemento html tag
   await page.waitForSelector('.ui-search-results')

   //$$ significa que se repite el elemento
   const listaItems = await page.$$('.ui-search-layout__item')

   let data = []
   for(const item of listaItems){

    //sacar el elemento renderizado
    const objectoPrecio = await item.$('.price-tag-fraction')
    //del elemento sacar el texto
    const getPrice = await page.evaluate(objectoPrecio => objectoPrecio.innerText, objectoPrecio)

     //sacar el elemento renderizado
     const objectoNombre = await item.$('.ui-search-item__title')
     //del elemento sacar el texto
     const getName = await page.evaluate(objectoNombre => objectoNombre.innerText, objectoNombre)

     //obtener imagen ingresar a atributo
     const image = await item.$('.ui-search-result-image__element')
    const getImage = await page.evaluate(image => image.getAttribute('src'), image)

     console.log(`${getPrice} -- ${getName} -- ${getImage}`)

     data.push({
         name:getName,
         price:getPrice,
         image:getImage
     })
   }
   

   //sacar foto de lo que esta viendo
   //await page.screenshot({path:'example.png'})

   //cerrar el navegador
   await browser.close()

   saveExcel(data)
}

const saveExcel = (data) =>{

    const workbook = new ExcelJS.Workbook()
    const filename = 'test.xlsx'

    const sheet = workbook.addWorksheet('Result')

    const reColums = [
        {header :'Nombre',key:'name'},
        {header :'Precio',key:'price'},
        {header :'Imagen',key:'image'}
    ]

    sheet.columns = reColums

    sheet.addRow(data)

    workbook.xlsx.writeFile(filename).then((e) =>{
        console.log('creado exitosamente')
    })
    .catch(()=>{
        console.log("error al crear")
    })
}


initialization()