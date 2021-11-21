const puppeteer = require('puppeteer')
const ExcelJS = require('exceljs')
const randomUseragent = require('random-useragent')

const query = "xiaomi note 10"
let count = 0
let browser
let page

let data = []
let iterator = 1

const initialization = async(urlparams = false) => {
    //crear useragebt solo de firefox
    const header = randomUseragent.getRandom((ua) =>{
        return ua.browserName === 'Firefox'
    })

    //si es la primera vez
    if(urlparams == false){
      //abrir el navegador sin interfaz
        browser = await puppeteer.launch({headless:false})

      //crear pestania
        page = await browser.newPage()
       //usar el useagent
         await page.setUserAgent(header)

    //simula que estoy en una pantalla grande, para que sepa que es una computadora
        await page.setViewport({width:1920,height:1080})
    }

    const urlMain = `https://listado.mercadolibre.com.ar/${query}`
    console.log("vuelta numero -->>>",count)
    console.log("visitando pagina--->",urlparams)

    if(count > 3){
        await browser.close()
        saveExcel(data)
    }else{ 
        await page.goto((urlparams) ? urlparams : urlMain)
        
        //buscar por clase (.) id (#) sin nada es elemento html tag
        await page.waitForSelector('.ui-search-results')
     
        //$$ significa que se repite el elemento
        const listaItems = await page.$$('.ui-search-layout__item')
    
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
     
         //obtener link del producto 
         const url = await item.$('.ui-search-link')
         const getLink =  await page.evaluate(url => url.getAttribute('href'), url) 
     
          data.push({
              number:iterator++,
              name:getName,
              price:getPrice,
              url:getLink,
              image:getImage
          })     
        }
     
          //pasar a la siguiente pagina
          const paginator = await page.$('.andes-pagination__button--next a')

         //verificar si existe
         if(!paginator){
             console.log("NO HAY MAS PAGINAS DISPONIBLES")
             await browser.close()
             saveExcel(data)
             return
         }

          const getNext = await page.evaluate(paginator => paginator.getAttribute('href'), paginator)
          console.log("paginador--->",getNext)
     
          count++
     
          initialization(getNext)
        //sacar foto de lo que esta viendo
        //await page.screenshot({path:'example.png'})
     
        //cerrar el navegador
       // await browser.close()
    }
  
}

const saveExcel = (data) =>{

    const workbook = new ExcelJS.Workbook()

    var today = new Date()

    const fechaCompleta = `${today.getDate()}-${ today.getMonth()}-${today.getFullYear()}_${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`

    const filename = `exports_${query}_${fechaCompleta}.xlsx`

    const sheet = workbook.addWorksheet('Mercado Libre', {properties:{tabColor:{argb:'FFF159'}}})

    const reColums = [
        {header :'Numero',key:'number',width: 5 },
        {header :'Nombre',key:'name', width: 70 },
        {header :'Precio',key:'price'},
        {header :'Url',key:'url',width: 50 },
        {header :'Imagen',key:'image',width: 50}
    ]

    sheet.columns = reColums

    sheet.addRows(data)

    workbook.addWorksheet('Fravega', {properties:{tabColor:{argb:'654BB9'}}})

    workbook.xlsx.writeFile(filename).then((e) =>{
        console.log('creado exitosamente')
    })
    .catch(()=>{
        console.log("error al crear")
    })

}


initialization()