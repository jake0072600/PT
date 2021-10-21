let COC=(()=>{

    class Car{
        constructor() {
        }

        doDW(basicValue){
            return Math.ceil(Math.random()*basicValue)
        }

        getStr(){
            return (this.doDW(6)+this.doDW(6)+this.doDW(6))*5;
        }
        getCon(){
            return (this.doDW(6)+this.doDW(6)+this.doDW(6))*5
        }
        getSiz(){
            return (this.doDW(6)+this.doDW(6)+6)*5
        }
        getDex(){
            return (this.doDW(6)+this.doDW(6)+this.doDW(6))*5
        }
        getApp(){
            return (this.doDW(6)+this.doDW(6)+this.doDW(6))*5
        }
        getInt(){
            return (this.doDW(6)+this.doDW(6)+6)*5
        }
        getPow(){
            return (this.doDW(6)+this.doDW(6)+this.doDW(6))*5
        }
        getEdu(){
            return (this.doDW(6)+this.doDW(6)+6)*5
        }
        getLuck(){
            return (this.doDW(6)+this.doDW(6)+this.doDW(6))*5
        }
    }


})()