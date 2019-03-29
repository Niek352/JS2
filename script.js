Vue.component('search',{
    data(){
        return{
            searchLine: ''
        }
    },
    template:`
        <div class="search">
            <form @submit.prevent="$emit('search', searchLine)">
                <button class="search-button" type="submit"> Искать</button>
                <input type="text" class="goods-search" v-model="searchLine"/>
            </form>
        </div> 
         `    
})

Vue.component('cart',{
    props:['cart'],
    template:`
            <div class="cart">
                <div class="goodInCart" v-for="good in cart">
                    <h3>{{ good.product_name }}</h3>
                    <button class="deleteFromCart" @click="minusToCart(good.id_product)"> delete </button>
                    <p class="countInCart">{{ good.count }}</p>
                    <button class="addOneMoreToCart" @click="plusToCart(good.id_product)"> add </button>                  
                </div>
            </div> 
            `    
})




Vue.component('good-list',{
    props:['goods'],
    template:`
    <div class="good-list">
        <goods-item v-for="good in goods" :key="good.id_product" :good="good" ></goods-item>
    </div>
    `
})
Vue.component('goods-item',{
    props:['good'],
    template:`
        <div class="goods-item">
            <h3>{{ good.product_name }}</h3>
            <p>{{ good.price }}</p>
            
        </div>
    `
})


const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        isVisibleCart: false,
        cart: {}
    },
    methods: {
        filterGoods(value) {
            const regexp = new RegExp(value, 'i');
            this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
        },

        showCart(){
            this.isVisibleCart = !this.isVisibleCart;
        },

        deleteAllFromCart(){
            for (let key in this.cart) {
                console.log(this.cart[key]);
                delete this.cart[key];
            }
        },

        makeGETRequest(url, callback) {
            var xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) { 
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    callback(JSON.parse(xhr.responseText));
                }
            }
            xhr.open('GET', url, true);
            xhr.send();    
        },

        plusToCart(id){
            this.cart[id].count++;
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        minusToCart(id){
            this.cart[id].count--;
            if (this.cart[id].count < 1) {
                delete this.cart[id]; 
            }
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        
        addToCart(id, name, price){
            if (this.cart[id] == undefined) {
                let x = {
                    id_product: id,
                    product_name: name,
                    price: price,
                    count: 1
                }
                this.cart[id] = x;
            }   else    {
                this.cart[id].count = 1 + this.cart[id].count;   
            }                 
            localStorage.setItem('cart', JSON.stringify(this.cart));
        }

    },
        mounted() {
            this.makeGETRequest(`https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json`, (goods) => {
                this.goods = goods;
                this.filteredGoods = goods;
                if (localStorage.getItem('cart') != null) {
                    this.isVisibleCart = true;
                    this.cart = JSON.parse(localStorage.getItem('cart'));
                }        
            });
        },
});

/*<button :id="good.id_product" @click="addToCart(good.id_product, good.product_name, good.price)" class="AddGoodsButton" type="button">Добавить</button>*/