const facadeExcel = require('./facade/excel')

const{ searchQuestion } = require('./questions/prompt')
const { ECOMMERCES } = require('./utils/constans')

const puppeteer = require('puppeteer')
const randomUseragent = require('random-useragent')
const inquirer = require('inquirer')
const chalk = require('chalk');

let browser
let page
let data = []

const initialization = async () =>{

    const {search, ecommerce } =  await inquirer.prompt(searchQuestion)
    
    for(const ec of ecommerce){
        const urlEcommerce = `${ECOMMERCES[ec]}${search}`
        await processScraping(false,urlEcommerce)
    }
}

const processScraping = async (urlNext = false,urlEcommerce = false) => {
    const header = randomUseragent.getRandom((ua) =>{
        return ua.browserName === 'Firefox'
    })
    
    if(urlNext == false){
        browser = await puppeteer.launch({headless:false}) //abrir el navegador
        page = await browser.newPage() // crear una pestania
        await page.setUserAgent(header) // setear el useagent
        await page.setViewport({width:1920,height:1080}) //simulacion de resolucion
    }

    const link = (urlNext) ? urlNext : urlEcommerce
    await page.goto(link)
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
            name:getName,
            price:getPrice,
            url:getLink,
            image:getImage
        })
    }   

    const paginator = await page.$('.andes-pagination__button--next a')

    if(paginator){
        const getNext = await page.evaluate(paginator => paginator.getAttribute('href'), paginator)
        processScraping(getNext,false)
    }else{  
        await browser.close()
        facadeExcel.buildDocument(data)

    }

  
}

initialization()