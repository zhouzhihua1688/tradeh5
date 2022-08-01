const domain = 'http://appuat.99fund.com.cn:7081'; //uat;

// const domain = 'https://wxappdev.99fund.com';
// const domain = 'http://appsit.99fund.com.cn:7081'; //sit;
// const request = require('request').defaults({jar: true});
// const domain='https://app.99fund.com';
const request = require('request');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

module.exports = function (app) {
  app.use('/tradeh5/newWap/*', (req, res, next) => {
    console.log('app.user /tradeh5/newWap/ originalUrl=', req.originalUrl);
    // let pathUrl = req.params.pathUrl;
    let pathUrl = req.originalUrl.slice(16);
    console.log('pathUrl=', pathUrl);
    

    if (pathUrl === '') {
      return res.redirect(`/tradeh5/newWap/login.html`);
    }
    if (pathUrl.includes('.html')) {
      let path = pathUrl.split('?')[0];
      // return res.render(`${path.replace(/\//, '')}`, {});
      return res.render(`${path}`, {});
    }
    if (pathUrl.match(/\.(gif|jpg|png|js|css|ico)($|(\?.*?$))/ig)) {
      return res.status(404).send('Not Found');
    }

    next();
  });

  app.use('*', (req, res, next) => {
    console.log('app.user * originalUrl=', req.originalUrl);
    if (req.originalUrl === '/favicon.ico') {
      return res.sendFile(path.join(__dirname, '../public/favicon.ico'));
    }
    if (req.originalUrl === '/') {
      return res.render(`login.html`,{})
    }
    if (req.originalUrl.includes('.html')) {
      let path = req.originalUrl.split('?')[0];
      // return res.render(`${path.replace(/\//, '')}`, {});
      return res.render(`${path.slice(1)}`, {});
    }
    if (req.originalUrl.match(/\.(gif|jpg|png|js|css|ico)($|(\?.*?$))/ig)) {
      return res.status(404).send('Not Found');
    }
    console.log('req.headers.cookie=', req.headers.cookie);
    try {
      let option = {
        url: `${domain}${req.originalUrl}`, 
        headers: {
          'Cookie': req.headers.cookie,

          // "Host": "appuat.99fund.com.cn:7081",
          // "Connection": "keep-alive",
          // "Content-Length": "78",
          // "Pragma": "no-cache",
          // "Cache-Control": "no-cache",
          // "Accept": "application/json, text/javascript, */*; q=0.01",
          // "X-Requested-With": "XMLHttpRequest",
          // "Content-Type": "application/json",
          // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
          "version": "6.1",
          // "Origin": "http://appuat.99fund.com.cn:7081",
          // "Referer": "http://appuat.99fund.com.cn:7081/mobileEC/wap/login/login.html",
          // "Accept-Encoding": "gzip, deflate",
          // "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,nl;q=0.6,ja;q=0.5",

        },
        body: Object.assign({}, req.body),
        qs: Object.assign({}, req.query),
        method: req.method,
        timeout: 15000,
        json: true
      };
      
      if(req.headers['content-type'] && ~req.headers['content-type'].indexOf('multipart/form-data')){
        // 有表单的提交，一般有文件上传
        delete option.body;
        delete option.json;
        option['Content-Type'] = 'multipart/form-data';    // 使用默认值覆盖boundary
        // option.headers = Object.assign(option.headers, req.headers);
        // delete option.headers.host;
        // delete option.headers.origin;
        // delete option.headers.referer;
        try {
          console.log('req.headers=', req.headers);
          let form = new formidable.IncomingForm();
          form.uploadDir = __dirname;   // 上传文件的临时文件夹，请求结束后删除临时文件
          form.keepExtensions = true;
          form.parse(req, (err, fields, files) => {
            console.log('数据接收完毕:', fields);
            console.log('文件接收完毕:', files);
            // option.formData = Object.assign({}, fields, files);
            // option.formData.front = fs.createReadStream(files['front'].path);
            // option.formData.back = fs.createReadStream(files['back'].path);
            option.formData = fields;
            for (const key in files) {
              if (Object.hasOwnProperty.call(files, key)) {
                const file = files[key];
                option.formData[key] = fs.createReadStream(file.path);
              }
            }
            console.log('---------------------------option1', option);
            sendRequest2backend(req, res, option);
          });
          
        } catch (error) {
          console.log('error======', error);
        }

      }else{
        console.log('---------------------------option2', option);
        sendRequest2backend(req, res, option);
      }

    } catch (error) {
        console.log('error=', error);
    }
  })
};


function sendRequest2backend(req, res, option) {
  // request.defaults({'proxy':'http://127.0.0.1:8888'}) //返回值是request
  request(option, (error, response, body) => {
    console.log('----------------------------error:', error);
    if (error) {
      return res.send({
        returnCode: 9999,
        returnMsg: '本地服务Error',
        body: null
      });
    }

    // form表单上传中有附件的情况，删除临时文件
    if(option.formData){
      for (const key in option.formData) {
        if (Object.hasOwnProperty.call(option.formData, key)) {
          const item = option.formData[key];
          if(item instanceof fs.ReadStream) {
            try {
              fs.unlinkSync(item.path);
            } catch (error) {
              console.log('sendRequest2backend error=', error);
            }
          }
        }
      }
    }

    console.log('----------------------------response.statusCode', response && response.statusCode);
    console.log('----------------------------body:', body);
    console.log('---------------------------服务器response.headers:', response.headers);
    // if (Array.isArray(response.headers['set-cookie']) && response.headers['set-cookie'].length > 0) { // login设置cookie
    //   response.headers['set-cookie'].forEach(cookie => {
    //     let cookieInfo = formatCookie(cookie);
    //     // console.log('---------cookieInfo',cookieInfo);
    //     res.cookie(cookieInfo.name, unescape(cookieInfo.value), cookieInfo.settingInfo);
    //   });
    // }

    // res.header('set-cookie', response.headers['set-cookie']);

    console.log("response.headers['set-cookie']=", response.headers['set-cookie']);
    let cookieList = response.headers['set-cookie'];
    if(cookieList){
      res.header('set-cookie', cookieList);
      // 服务端返回的set-cookie处理为当前开发使用的domain
      cookieList = cookieList.map((item)=>{return item.replace(/(Domain=.99fund.com.cn;|Domain=.99fund.com;)/ig, 
        'Domain='+req.headers.host.replace(/.*?(\.99fund\.com\.cn)(\:\d*)*/g, '.99fund.com.cn')+';')})
        // 'Domain=.99fund.com.cn;')})
      res.header('set-cookie', cookieList);
    }
    console.log('cookieList=', cookieList);
    let xServerTime = response.headers['x-server-time'];
    if(xServerTime){
      res.header('x-server-time',xServerTime)
    }
    
    return res.send(body);
  }); 
}


function formatCookie(cookieStr) {
  let arr = cookieStr.split('; ');
  let name = arr[0].split('=')[0];
  let value = arr[0].split('=')[1];
  let settingInfo = {};
  for (let i = 1; i < arr.length; i++) {
      settingInfo[arr[i].split('=')[0]] = arr[i].split('=')[1];
  }
  return {
      name,
      value,
      settingInfo: {
          domain: settingInfo.Domain ? settingInfo.Domain.slice(1) : '',
          Path: settingInfo.Path ? settingInfo.Path : '/'
      }
  };
}