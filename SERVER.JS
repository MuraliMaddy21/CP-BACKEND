const express = require("express");
const parser = require("xml2js")
const fs = require("fs");
const bodyParser = require("body-parser");
var cors = require("cors")
const {response} = require('express')
const app = express();
require('dotenv').config();
const X2JS = require('x2js')
const { exit } = require("process");
const accountSid = 'ACdbc551338855ad25fedecadf7207e3b2'; 
const authToken = process.env.AUTH; 
const client = require('twilio')(accountSid, authToken); 
const folderPath = "D:/payslip";
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
app.use(cors())




app.use(bodyParser.json())

var customerid;
var password;
var auth;

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
var otp;


app.post('/otp',function(req,res)
{
  otp=req.body.otp;
  console.log(otp);
  const message=`Hello your Login otp is ${otp}!`
   client.messages 
      .create({ 
         body: message,  
         messagingServiceSid: 'MG3b1bb34d27f2176205c43dbd554b58e0',      
         to: '+919150064160' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();

      const msg = {
        to: 'muraliramboo12@gmail.com', 
        from: 'muralidharanportals@proton.me', 
        subject: 'LOGIN ATTEMPT-Reg',
        html: `Hello your Login otp is ${otp}!`,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
      

   res.send("OTP SENT SUCCESSFULLY")

})

app.post('/cplogin',function(req,res) 
{

  var result1;
    console.log(req.body.customerid)
    console.log(req.body.password)
    customerid = req.body.customerid
    password = req.body.password
    
    auth={
      "cid":customerid
    }

    var request = require('request');
    var options = {
  'method': 'POST',
  'url': 'https://KTINDHNA02.kaartech.com:8001/sap/bc/srt/rfc/sap/zws_cp_md_login/100/zws_cp_md_login/zws_cp_md_login',
  'headers': {
    'Content-Type': 'Content-Type: application/soap+xml;charset=UTF-8;action="urn:sap-com:document:sap:rfc:functions:ZWS_CP_MD_LOGIN:ZFM_LOGIN_CP_MDRequest"',
    'Authorization': 'Basic YWJhcGVyMTphYmFwQDEyMw==',
    'Cookie': 'sap-usercontext=sap-client=100'
  },
  body: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZFM_LOGIN_CP_MD>\r\n         <I_CUS_ID>${customerid}</I_CUS_ID>\r\n         <I_PASSWORD>${password}</I_PASSWORD>\r\n      </urn:ZFM_LOGIN_CP_MD>\r\n   </soap:Body>\r\n</soap:Envelope>`

};

request(options, function (error, response) {
  if (error) throw new Error(error);
  var x2js = new X2JS();
  result1 = x2js.xml2js(response.body)
  result1 = JSON.stringify(result1)
  console.log(result1);
  var status = response.body;
  status = x2js.xml2js(status)
  status=status['Envelope']['Body']['ZFM_LOGIN_CP_MDResponse']['E_MESSAGE']
  console.log(status)
  res.send(result1)
  if(status == "S")
  {
    client.messages 
      .create({ 
         body: 'CUSTOMER PORTAL-Login Attempt Made!Login Successful!',  
         messagingServiceSid: 'MG3b1bb34d27f2176205c43dbd554b58e0',      
         to: '+919150064160' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();

      const msg = {
        to: 'muraliramboo12@gmail.com', 
        from: 'muralidharanportals@proton.me', 
        subject: 'LOGIN ATTEMPT-Reg',
        text: 'CUSTOMER PORTAL-Login Attempt Made!Login Successful!',
        html: '<strong>CUSTOMER PORTAL-Login Attempt Made!Login Successful!</strong>',
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
      
  }
  else{
    client.messages 
      .create({ 
         body: 'CUSTOMER PORTAL-Login Attempt Made!Login Failure!Check Credentials',  
         messagingServiceSid: 'MG3b1bb34d27f2176205c43dbd554b58e0',      
         to: '+919150064160' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();

  const msg = {
  to: 'muraliramboo12@gmail.com', 
  from: 'muralidharanportals@proton.me', 
  subject: 'LOGIN ATTEMPT-Reg',
  text: 'CUSTOMER PORTAL-Login Attempt Made!Login Failure!Check Credentials',
  html: '<strong>CUSTOMER PORTAL-Login Attempt Made!Login Failure!Check Credentials!</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

  
  }
 
 });

})


app.get('/getauth',function(req,res)
{

 
  res.json(auth)

})



app.get('/cpprofile',function(req,res) 
{
  var result2;

  var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://KTINDHNA02.kaartech.com:8001/sap/bc/srt/rfc/sap/zws_cp_md_profile/100/zws_cp_md_profile/zws_cp_md_profile',
  'headers': {
    'Content-Type': 'Content-Type: application/soap+xml;charset=UTF-8;action="urn:sap-com:document:sap:rfc:functions:ZWS_CP_MD_PROFILE:ZFM_PROFILE_CP_MDRequest"',
    'Authorization': 'Basic YWJhcGVyMTphYmFwQDEyMw==',
    'Cookie': 'sap-usercontext=sap-client=100'
  },
  body: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZFM_PROFILE_CP_MD>\r\n         <I_CUS_ID>${customerid}</I_CUS_ID>\r\n      </urn:ZFM_PROFILE_CP_MD>\r\n   </soap:Body>\r\n</soap:Envelope>`

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  var x2js = new X2JS();
  result2 = x2js.xml2js(response.body)
  result2 = JSON.stringify(result2)
  res.send(result2)
});


});


app.get('/cpinvoice',function(req,res)
{
  var result3;
  var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://KTINDHNA02.kaartech.com:8001/sap/bc/srt/rfc/sap/zws_cp_md_invoice/100/zws_cp_md_invoice/zws_cp_md_invoice',
  'headers': {
    'Content-Type': 'Content-Type: application/soap+xml;charset=UTF-8;action="urn:sap-com:document:sap:rfc:functions:ZWS_CP_MD_INVOICE:ZFM_INVOICE_CP_MDRequest"',
    'Authorization': 'Basic YWJhcGVyMTphYmFwQDEyMw==',
    'Cookie': 'sap-usercontext=sap-client=100'
  },
  body: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZFM_INVOICE_CP_MD>\r\n         <!--Optional:-->\r\n         <IT_INVOICE>\r\n            <!--Zero or more repetitions:-->\r\n            \r\n         </IT_INVOICE>\r\n         <I_CUS_ID>${customerid}</I_CUS_ID>\r\n      </urn:ZFM_INVOICE_CP_MD>\r\n   </soap:Body>\r\n</soap:Envelope>`

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  var x2js = new X2JS();
  result3 = x2js.xml2js(response.body)
  result3 = JSON.stringify(result3)
  res.send(result3)
});


})

app.get('/cpdllist',function(req,res)
{
  var result4;
  var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://KTINDHNA02.kaartech.com:8001/sap/bc/srt/rfc/sap/zws_cp_md_dellist/100/zws_cp_md_dellist/zws_cp_md_dellist',
  'headers': {
    'Content-Type': 'Content-Type: application/soap+xml;charset=UTF-8;action="urn:sap-com:document:sap:rfc:functions:ZWS_CP_MD_DELLIST:ZFM_DELIVERYLIST_CP_MDRequest"',
    'Authorization': 'Basic YWJhcGVyMTphYmFwQDEyMw==',
    'Cookie': 'sap-usercontext=sap-client=100'
  },
  body: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZFM_DELIVERYLIST_CP_MD>\r\n         <!--Optional:-->\r\n         <IT_DELIVERY>\r\n            <!--Zero or more repetitions:-->\r\n            \r\n         </IT_DELIVERY>\r\n         <I_CUS_ID>${customerid}</I_CUS_ID>\r\n      </urn:ZFM_DELIVERYLIST_CP_MD>\r\n   </soap:Body>\r\n</soap:Envelope>`

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  var x2js = new X2JS();
  result4 = x2js.xml2js(response.body)
  result4 = JSON.stringify(result4)
  res.send(result4)
});

})

app.get('/cpcredit',function(req,res)
{
  var result5;
  var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://KTINDHNA02.kaartech.com:8001/sap/bc/srt/rfc/sap/zws_cp_md_credeb/100/zws_cp_md_credeb/zws_cp_md_credeb',
  'headers': {
    'Content-Type': 'Content-Type: application/soap+xml;charset=UTF-8;action="urn:sap-com:document:sap:rfc:functions:ZWS_CP_MD_CREDEB:ZFM_CREDIT_DEBIT_MEMO_CP_MDRequest"',
    'Authorization': 'Basic YWJhcGVyMTphYmFwQDEyMw==',
    'Cookie': 'sap-usercontext=sap-client=100'
  },
  body: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZFM_CREDIT_DEBIT_MEMO_CP_MD>\r\n         <!--Optional:-->\r\n         <IT_CRE>\r\n            <!--Zero or more repetitions:-->\r\n         \r\n         </IT_CRE>\r\n         <!--Optional:-->\r\n         <IT_DEB>\r\n            <!--Zero or more repetitions:-->\r\n           </IT_DEB>\r\n         <I_CUS_ID>${customerid}</I_CUS_ID>\r\n      </urn:ZFM_CREDIT_DEBIT_MEMO_CP_MD>\r\n   </soap:Body>\r\n</soap:Envelope>`

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  var x2js = new X2JS();
  result5 = x2js.xml2js(response.body)
  result5 = JSON.stringify(result5)
  res.send(result5)
});


})

app.get('/cpinquiry',function(req,res)
{
  var result6;
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://KTINDHNA02.kaartech.com:8001/sap/bc/srt/rfc/sap/zws_cp_md_inquiry/100/zws_cp_md_inquiry/zws_cp_md_inquiry',
  'headers': {
    'Content-Type': 'application/soap+xml;charset=UTF-8;action="urn:sap-com:document:sap:rfc:functions:ZWS_CP_MD_INQUIRY:ZFM_INQUIRY_CP_MDRequest"',
    'Authorization': 'Basic YWJhcGVyMTphYmFwQDEyMw==',
    'Cookie': 'sap-usercontext=sap-client=100'
  },
  body: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZFM_INQUIRY_CP_MD>\r\n         <I_CUS_ID>${customerid}</I_CUS_ID>\r\n         <!--Optional:-->\r\n         <ZSD_INQ_T>\r\n            <!--Zero or more repetitions:-->\r\n   \r\n         </ZSD_INQ_T>\r\n      </urn:ZFM_INQUIRY_CP_MD>\r\n   </soap:Body>\r\n</soap:Envelope>`

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  var x2js = new X2JS();
  result6 = x2js.xml2js(response.body)
  result6 = JSON.stringify(result6)
  res.send(result6)
});

})

app.get('/cppayage',function(req,res)
{
  var result7;
  var request = require('request');
  var options = {
    
    'method': 'POST',
    'url': 'https://KTINDHNA02.kaartech.com:8001/sap/bc/srt/rfc/sap/zws_cp_md_payage/100/zws_cp_md_payage/zws_cp_md_payage',
    'headers': {
      'Content-Type': 'application/soap+xml;charset=UTF-8;action="urn:sap-com:document:sap:rfc:functions:ZWS_CP_MD_PAYAGE:ZFM_PAYMENTAGE_CP_MDRequest"',
      'Authorization': 'Basic YWJhcGVyMTphYmFwQDEyMw==',
      'Cookie': 'sap-usercontext=sap-client=100'
    },
    body: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZFM_PAYMENTAGE_CP_MD>\r\n         <IT_DET>\r\n            <!--Zero or more repetitions:-->\r\n            <item>\r\n               \r\n            </item>\r\n         </IT_DET>\r\n         <I_COM_CODE>0001</I_COM_CODE>\r\n         <I_CUS_ID>${customerid}</I_CUS_ID>\r\n         <!--Optional:-->\r\n         <I_DOC_DATE></I_DOC_DATE>\r\n      </urn:ZFM_PAYMENTAGE_CP_MD>\r\n   </soap:Body>\r\n</soap:Envelope>`
  
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    var x2js = new X2JS();
    result7 = x2js.xml2js(response.body)
    result7 = JSON.stringify(result7)
    res.send(result7)
  });
  

})

app.get('/cpsalord',function(req,res)
{
  var result8;
  var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://KTINDHNA02.kaartech.com:8001/sap/bc/srt/rfc/sap/zws_cp_md_saleorder/100/zws_cp_md_saleorder/zws_cp_md_saleorder',
  'headers': {
    'Content-Type': 'Content-Type: application/soap+xml;charset=UTF-8;action="urn:sap-com:document:sap:rfc:functions:ZWS_CP_MD_SALEORDER:ZFM_SALESORDER_CP_MDRequest"',
    'Authorization': 'Basic YWJhcGVyMTphYmFwQDEyMw==',
    'Cookie': 'sap-usercontext=sap-client=100'
  },
  body: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <urn:ZFM_SALESORDER_CP_MD>\r\n         <I_CUS_ID>${customerid}</I_CUS_ID>\r\n         <I_DOCDATE_FROM></I_DOCDATE_FROM>\r\n         <I_DOCDATE_TO></I_DOCDATE_TO>\r\n         <I_EXMATNR>\r\n            <MATERIAL_EXT></MATERIAL_EXT>\r\n            <MATERIAL_VERS></MATERIAL_VERS>\r\n            <MATERIAL_GUID></MATERIAL_GUID>\r\n         </I_EXMATNR>\r\n         <I_MATNR></I_MATNR>\r\n         <I_PURORDER></I_PURORDER>\r\n         <I_PURORDER_NUM></I_PURORDER_NUM>\r\n         <I_SALES_ORG>0001</I_SALES_ORG>\r\n      </urn:ZFM_SALESORDER_CP_MD>\r\n   </soap:Body>\r\n</soap:Envelope>`

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  var x2js = new X2JS();
    result8 = x2js.xml2js(response.body)
    result8 = JSON.stringify(result8)
    res.send(result8)
});


})

app.get('/shutdown',function(req,res)
{

 
  exit();


})

app.get('/pdf',function(req,res)
{

 
  res.download(folderPath+'/invoice.pdf', function(err) {
    if(err) {
        console.log(err);
    }


  })

})





app.listen(3030,()=>
{
    console.log("server listening on port 3030")
});
