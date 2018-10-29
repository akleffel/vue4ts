/// <reference path="../src/vue4ts.ts">

class MyApplication extends VueClass
{
    isAlert: boolean = false;
    testMessage: string = null;
    articles: Array<ArticleViewModel> = null;

    get articleCount()
    {
        return this.articles == null ? 0 : this.articles.length;
    }

    doTest()
    {
        this.testMessage = 'My test number is ' + Math.random();
    }

    addArticle()
    {
        if(this.articles == null)
            this.articles = new Array<ArticleViewModel>();

        var item = new ArticleViewModel();
        item.title = 'article ' + (this.articles.length + 1);
        item.summary = 'just a little box component';

        this.articles.push(item);
    }

    mounted()
    {
        this.$nextTick(()=> {
            alert('The component is mounted and rendered!')
        });
    }

    updated()
    {
        this.$nextTick(()=> {
            for(let i=0; i<this.$children.length;i++){
                var myBox = this.$children[i] as Box;

                // just to demo the API hooks, no good idea to change element without binding
                myBox.$el.style.background = 'yellow';
            }
        });
    }
}

class Box extends VueComponent
{
    article: ArticleViewModel = null;
}

class ArticleViewModel
{
    title: string = null;
    summary: string = null;
}

window.onload = () => {

    Vue4Ts.component(new Box('box', document.getElementById('boxTemplate').innerHTML));
    Vue4Ts.vue(new MyApplication(), '#container');
}