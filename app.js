class App{
    constructor(selectors){
            this.flicks=[]
            this.max=0
            this.currentCat=''
            this.list=document.querySelector(selectors.listSelector)
            this.catList=document.querySelector(selectors.catagoryList)
            this.template=document.querySelector(selectors.templateSelector)
            this.catTemplate=document.querySelector(selectors.catagoryTemp)
            document
            .querySelector(selectors.catagorySelector)
            .addEventListener('submit',this.addResponseViaForm.bind(this))
            this.load()  
    }
    addResponseViaForm(ev) {
        ev.preventDefault()
        const movieName= ev.target.response.value
    
        const f =ev.target
        const flick = { 
            id: this.max+1,
            name: f.response.value,
            catagory: f.catagory.value,
            good: 'ehh',
            }
        this.addFlick(flick)
        this.currentCat=flick.catagory
        this.differentCat()
        f.reset()
    }
    addFlick(flick){

        const index =this.flicks.findIndex((currentFlick, i) =>{
            return currentFlick.catagory===flick.catagory
        })

        if(flick.catagory===this.currentCat){
            const listItem =this.renderListItem(flick)
            this.list.insertBefore(listItem,this.list.firstChild)
            }

        if(index===-1){
            const cat =this.renderCatagories(flick)
            this.catList.insertBefore(cat,this.catList.firstChild)
        }
        this.max++
        this.flicks.unshift(flick)
        this.save()

    }

renderCatagories(flick){
    const item =this.catTemplate.cloneNode(true)
    item.querySelector('.catagory-name').textContent=flick.catagory
    item.dataset.catagory= flick.catagory
    item.classList.remove('template')
    item.addEventListener('click',this.newCatagory.bind(this))
    return item
}


    renderListItem(flick){
         const item =this.template.cloneNode(true)
        item.querySelector('.flick-name').textContent=flick.name
        item.dataset.catagory=flick.catagory
        item.dataset.id = flick.id
        item.classList.remove('template')
        item.querySelector('.remove').addEventListener('click',this.removeMovie.bind(this))
        item.querySelector('.favorite').addEventListener('click',this.promote.bind(this))
        item.querySelector('.up').addEventListener('click',this.flipUp.bind(this))
        item.querySelector('.down').addEventListener('click',this.flipDown.bind(this))
        item.querySelector('.flick-name').addEventListener('input',this.edited.bind(this))
        if(flick.good==='red'){
            this.prom(item)
        }
            return item   
    }

    removeMovie(ev) {
        const listI=ev.target.closest('.flick')
        listI.remove()
        for(let i =0; i < this.flicks.length;i++){
            const currentId=this.flicks[i].id.toString()
        if(currentId===listI.dataset.id){
            this.flicks.splice(i,1)
            this.save()
            break
        }

        }
    }
    save(){
        localStorage.setItem('flicks',JSON.stringify(this.flicks))
    }

    load(){
        const flicksJSON=localStorage.getItem('flicks')
        const flicksArray=JSON.parse(flicksJSON)
        if(flicksArray){
            flicksArray.reverse().map(this.addFlick.bind(this))
        }
        for(let i=0;i<this.flicks.length;i++){
            if(this.flicks[i].id>this.max){
                this.max=this.flicks[i].id+1
            }
        }
    }


    flipUp(ev){
        const listI=ev.target.closest('.flick')
        if(this.list.firstChild!==listI){
            const prevSib=listI.previousSibling
            this.list.insertBefore(listI,prevSib)
        }
        let indexes=[]
            for(let i =0; i < this.flicks.length;i++){
                const currentId=this.flicks[i].id.toString()
                if(currentId===listI.dataset.id&&i>0){
                
                if(indexes.length>0){
                        const temp=this.flicks[i]
                        this.flicks[i]=this.flicks[indexes[indexes.length-1]]
                        this.flicks[indexes[indexes.length-1]]=temp
                        this.save()
                    }
                    break
                }
                if(this.flicks[i].catagory===listI.dataset.catagory){
                        indexes.push(i)}
            }

    }

    flipDown(ev){

let indexes=[]

        const listI=ev.target.closest('.flick')
        const nextSib=listI.nextSibling
        

        
        if(this.list.lastChild.previousSibling!==listI.nextSibling){
            this.list.insertBefore(nextSib,listI)
        }
        for(let i =this.flicks.length-1; i >= 0;i--){
            const currentId=this.flicks[i].id.toString()
            if(currentId===listI.dataset.id&&i<this.flicks.length-1){
                 if(indexes.length>0){
                const temp=this.flicks[i]
                this.flicks[i]=this.flicks[indexes[indexes.length-1]]
                this.flicks[indexes[indexes.length-1]]=temp
                this.save()
                }
                break
            }
            if(this.flicks[i].catagory===listI.dataset.catagory){
                    indexes.push(i)}
        }
    }
    promote(ev){
   
        const listI=ev.target.closest('.flick')
        if(listI.style.backgroundColor!=='red'){
         listI.style.backgroundColor='red'
        }
        else{
         listI.style.backgroundColor='white'
        }

        for(let i =0; i < this.flicks.length;i++){
            const currentId=this.flicks[i].id.toString()
            
        if(currentId===listI.dataset.id){
            
            this.flicks[i].good=listI.style.backgroundColor
        
            this.save()
            break
        }

        }

    }
    prom(listI){
         listI.style.backgroundColor='red'
    }
    edited(ev){

        const listI=ev.target.closest('.flick')

        for(let i =0; i < this.flicks.length;i++){
            const currentId=this.flicks[i].id.toString()            
            if(currentId===listI.dataset.id){
                this.flicks[i].name=ev.target.textContent
                this.save()
                break
            }
        }
    }

newCatagory(ev){

const cat =ev.currentTarget
this.currentCat=cat.dataset.catagory
this.differentCat()
}
differentCat(){
const nod= this.list.children
for(let j=0;j<nod.length-1;j++){  
nod[j].remove();j--
}

for(let i=this.flicks.length-1;i>=0 ;i--){
 
   if(this.flicks[i].catagory===this.currentCat){
       
    const listItem =this.renderListItem(this.flicks[i])
   this.list.insertBefore(listItem,this.list.firstChild)
}
} 
}
}
    const app = new App({
  listSelector: '#flick-list',
  catagoryList:'#catagory-list',
  templateSelector: '.flick.template',
  catagorySelector: '#catagory-form',
  catagoryTemp:'.catagory.template',
})