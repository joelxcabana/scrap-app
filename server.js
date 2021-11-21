const puppeteer = require('puppeteer')
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
   
   //sacar foto de lo que esta viendo
   //await page.screenshot({path:'example.png'})

   //cerrar el navegador
   await browser.close()
}

initialization()