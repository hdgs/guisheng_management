const send = require('koa-send');
const Koa = require('koa');
const Router = require('koa-router');
const userAgent = require('koa-useragent');
const path = require('path')
const swig = require('swig');
const bodyParser = require('koa-bodyparser');
var upload = require('./upload.js');
// const qiniuConfig = require('./qiniuconfig');
const router = new Router();
const app = new Koa();

const templateRoot = path.join(__dirname, "../dist/templates")

app.use(userAgent);
app.use(bodyParser());

router.get('/admin', function(ctx, next){
    let template = swig.compileFile(path.resolve(templateRoot, "home.html"));
    ctx.body = template({})
    if(!ctx.request.query.token && !ctx.cookies.get("token_auth")){
        ctx.redirect('https://user.muxixyz.com/?landing=gs.muxixyz.com/admin')
    }else if(ctx.request.query.email && ctx.request.query.token){
        ctx.cookies.set("email", ctx.request.query.email, {
            httpOnly: false,
        })
        ctx.cookies.set("token_auth", ctx.request.query.token, {
            httpOnly: false,
        })
    }
});

// router.get('/admin/editor/:kind/:id', function(ctx, next){
// 	console.log(ctx.userAgent)
//     let template = swig.compileFile(path.resolve(templateRoot, "editor.html"));
//         ctx.body = template({})
// });


router.post('/upload', async(ctx, next)=>{
    const serverPath = path.join(__dirname, './uploads/')

    const result = await upload.uploadFile(ctx, {
        fileType: 'album',
        path: serverPath
    })

    const imgPath = path.join(serverPath, result.imgPath)

    const qiniu_result = await upload.upToQiniu(imgPath, result.imgKey)

    upload.removeTemImage(imgPath)
    
    ctx.body = {
        imgUrl: `http://static.muxixyz.com/${qiniu_result.key}`
    }
})

router.get(/^\/admin\/static(?:\/|$)/, async (ctx) => {
    let filePath = ctx.path.replace(/admin\/static\//, "")
     await send(ctx, filePath, {
         root: path.join(__dirname, "../dist")
     });
})



app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(8080);
console.log('listening on port 8080');