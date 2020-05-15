import React from "react";
import {GoogleMap,
        withScriptjs,
        withGoogleMap, 
        Marker,
       } from "react-google-maps";
import $ from "jquery";
import { Bar } from 'react-chartjs-2';

var data;
var userloc={lat:22.302711,lng:114.177216};
var centerloc={lat:22.302711,lng:114.177216};
var distancedata=[];
class Map extends React.Component{
  render(){
      return(<div>
    <GoogleMap
    zoom={this.props.zoom}
    center={this.props.CenterLoc}//initial center
    onClick={this.props.maplistener}
    >
      {this.props.showdata.map(d=>(
        <Marker
                position={{
                  lat:d.latitude,
                  lng:d.longitude
                }}
                title={
                  'Stop name: '+d.name
                }
                onRightClick={this.props.markerClick}
          />
          
      ))}
      <Marker
        position={
         this.props.UserLoc
        }
        title={
          'User Location'
        }
        icon={
          {url:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
        }
        />
    </GoogleMap>
    </div>);
    
    
  }
}
const WrappedMap =withScriptjs(withGoogleMap(Map));
/* eslint-disable */
class Userchart extends React.Component{
  render(){
    if(this.props.showornot===true&&this.props.showornot1===false){
      return(
        <div className="barchart" style={{width:'100vw', height:'50vh',display:'inline-block'}}>
        <div><Bar style={{width:'50vw', height:'50vh',display:'inline-block'}}
       data={this.props.chartData}
       options={{
         maintainAspectRatio:false,
         scales: {
                   yAxes: [{
                      ticks: {
                      beginAtZero: true,
                       min: 0
                     }    
                   }]
                 },
          title:{
          display:true,
          text:"Top 5 STOPS with the most comments"
        },
        legend:{
          display:"true",
          position:"right"
        }
       }}
       /></div>
         <div><Bar style={{width:'50vw', height:'50vh',display:'inline-block'}}
       data={this.props.chartData1}
       options={{
         maintainAspectRatio:false,
         scales: {
                   yAxes: [{
                      ticks: {
                      beginAtZero: true,
                       min: 0
                     }    
                   }]
                 },
          title:{
          display:true,
          text:"Top 5 STOPS with the most routes"
        },
        legend:{
          display:"true",
          position:"right"
        }
       }}
       /></div>
       
       </div>
      );
    }
    else{
      return null;
    }
  }
}  
class Adminchart extends React.Component{
	render(){
		return(
			<div><Bar data={this.props.chartadmin}
       options={{
         maintainAspectRatio:false,
         scales: {
                   yAxes: [{
                      ticks: {
                      beginAtZero: true,
                       min: 0
                     }    
                   }]
                 },
          title:{
          display:true,
          text:"Top 5 USERS with the most favourite"
        },
        legend:{
          display:"true",
          position:"right"
        }
       }}
		       /></div>
	       
		       
		       );
		       
		       
		       }
	
}
    var alldata;
class Project extends React.Component
{

            constructor(props){
                super(props);
                this.state={
                  
                    name:null,
                    password:null,
                    Loginout:false,
                    showlog:false,
                      Searchtext:'',
                      showSign:false,
                      data:null,
                      Searchtype:'Criteria',
                      filteredDatas:null,
                      showdetail:false,
                      detailstop:null,
                      showfavorite:false,
                      favoritestop:null,
			admin:false,
                      user:null,
                      showuser:false,
                      actiontype:'Delete',
                     // below for map
                      UserLoc:userloc,
                      CenterLoc:centerloc,
                      //data:data,
                      CenterName:'DEFAULT',
                     showdata:null,//showdata for map marker
                     distanceall:null,
                     zoom:18,
                     detailmap:false,
		     chartData:{
                       labels:['stop1',"stop2",'stop3','shop4','shop5'],
                       datasets:[{
                         label:"Comment Number",
                         data:[10,5,5,5,10],
                         backgroundColor:[
                           'rgba(255,99,132,0.2)',
                           'rgba(54,162,235,0.2)',
                           'rgba(255,206,86,0.2)',
                           'rgba(75,192,192,0.2)',
                           'rgba(153,102,255,0.2)', 
                         ]
                       }]
                     },
                     chartData1:{
                      labels:['stop1',"stop2",'stop3','shop4','shop5'],
                      datasets:[{
                        label:"Route Number",
                        data:[10,5,5,5,10],
                        backgroundColor:[
                          'rgba(255,99,132,0.2)',
                          'rgba(54,162,235,0.2)',
                          'rgba(255,206,86,0.2)',
                          'rgba(75,192,192,0.2)',
                          'rgba(153,102,255,0.2)', 
                        ]
                      }]
                     },
		chartData2:{
                       labels:['user1',"user2",'user3','user4','user5'],
                       datasets:[{
                         label:"Favourite Number",
                         data:[2,3,4,5,6],
                         backgroundColor:[
                           'rgba(255,99,132,0.2)',
                           'rgba(54,162,235,0.2)',
                           'rgba(255,206,86,0.2)',
                           'rgba(75,192,192,0.2)',
                           'rgba(153,102,255,0.2)', 
                         ]
                       }]
                     },
                     chartData3:{
                      labels:['user1',"user2",'user3','user4','user5'],
                      datasets:[{
                        label:"Comment Number",
                        data:[10,5,5,5,10],
                        backgroundColor:[
                          'rgba(255,99,132,0.2)',
                          'rgba(54,162,235,0.2)',
                          'rgba(255,206,86,0.2)',
                          'rgba(75,192,192,0.2)',
                          'rgba(153,102,255,0.2)', 
                        ]
                      }]
                     }
                      
                      
        }
    }
    componentWillMount(){
	    const routeline=['1','10','592','102P','103','90','118','117','12A','70'];
        var num;

                alldata=[];
                num=0;
                for(let index1 in routeline){
                  $.ajax({
                      url:"https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/ctb/"+routeline[index1]+"/inbound",
                      type:'GET',
                      
                      success:function(result){
  
                       for(let index in result.data){
              
                         $.ajax({
                           url:"https://rt.data.gov.hk/v1/transport/citybus-nwfb/stop/"+result.data[index].stop,
                           type:'GET',
                           
                           success:function(res){
  
                            var newdata={stopId:result.data[index].stop,lat:res.data.lat,long:res.data.long,route:routeline[index1],name:res.data.name_en};
                              console.log(newdata);
                              alldata.push(newdata);
                                       num++;
                                       if (num==229){
                                          $.ajax({
                              url:'http://csci2720.cse.cuhk.edu.hk/2011/data',
                              type:"POST",
                              data:{alldata:alldata},
                              success:function(re){
                               console.log("success!");
                               },
                               error:function(error){
                                   console.log(error);
                               }
                    }); 
					       
				       }
                                                }
                                });
                        
                                                }
                                         }
         
                        });}
	   
     //console.log(data);
	    var x;
   $.ajax({type:'GET',url:"http://csci2720.cse.cuhk.edu.hk/2011/getdata",async :false,
        success:(res)=>{ 
           
             x=res.filter(function(value) {if (value.latitude==null||value.arrival.length==0)return false; return true;})
          
            this.setState({data:x, filteredDatas:x,showdata:x}) 
            
            } 
        
        
        })
	    
	     for(let index in x){
      var lat1=x[index].latitude;
      var lat2=this.state.UserLoc.lat;
      var lng1=x[index].longitude;
      var lng2=this.state.UserLoc.lng;
      var R=6378137;
      var dlat=(lat1-lat2)*Math.PI/180;
      var dlng=(lng1-lng2)*Math.PI/180;
      var dlat1=lat1*Math.PI/180;
      var dlat2=lat2*Math.PI/180;
      var a=Math.sin(dlat/2)*Math.sin(dlat/2)+Math.cos(dlat1)*Math.cos(dlat1)*Math.sin(dlng/2)*Math.sin(dlng/2);
      var c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
      var d=R*c;
      distancedata.push({name:x[index].name,distance:d});
      //console.log(distancedata);
    }
     this.setState({
       distanceall:distancedata
     });
     var temp=x;
var temp1=x;
     var compare1=function(x,y){
      if(x.arrival.length>y.arrival.length){
        return -1;
      }else{
        return 0;
      }
     }
     var compare=function(x,y){
       if(x.comment.length>y.comment.length){
         return -1;
       }else{
         return 0;
       }
     }
     temp1=temp1.sort(compare1);
     temp=temp.sort(compare);
     var topfivename=[];
     var topfivenum=[];
     topfivename.push(temp[0].name);
     topfivename.push(temp[1].name);
     topfivename.push(temp[2].name);
     topfivename.push(temp[3].name);
     topfivename.push(temp[4].name);
     topfivenum.push(temp[0].comment.length);
     topfivenum.push(temp[1].comment.length);
     topfivenum.push(temp[2].comment.length);
     topfivenum.push(temp[3].comment.length);
     topfivenum.push(temp[4].comment.length);
     var topfivename1=[];
     var topfivenum1=[];
     topfivename1.push(temp1[0].name);
     topfivename1.push(temp1[1].name);
     topfivename1.push(temp1[2].name);
     topfivename1.push(temp1[3].name);
     topfivename1.push(temp1[4].name);
     topfivenum1.push(temp1[0].arrival.length);
     topfivenum1.push(temp1[1].arrival.length);
     topfivenum1.push(temp1[2].arrival.length);
     topfivenum1.push(temp1[3].arrival.length);
     topfivenum1.push(temp1[4].arrival.length);
	if(topfivenum[0]!==0){
	this.setState({
      chartData:{
        labels:topfivename,
        datasets:[{
          label:"Comment Number",
          data:topfivenum,
          backgroundColor:[
            'rgba(255,99,132,0.2)',
            'rgba(54,162,235,0.2)',
            'rgba(255,206,86,0.2)',
            'rgba(75,192,192,0.2)',
            'rgba(153,102,255,0.2)', 
          ]
        }]
      }
      });
	}
		this.setState({
      chartData1:{
        labels:topfivename1,
        datasets:[{
          label:"Route Number",
          data:topfivenum1,
          backgroundColor:[
            'rgba(255,99,132,0.2)',
            'rgba(54,162,235,0.2)',
            'rgba(255,206,86,0.2)',
            'rgba(75,192,192,0.2)',
            'rgba(153,102,255,0.2)', 
          ]
        }]
       }
    });
			
   }
componentDidMount(){

    }
    
        test=()=>{
        const routeline=['1','10','592','102P','103','90','118','117','12A','70'];
        var num;

                var alldata=[];
                num=0;
                for(let index1 in routeline){
                    

                   $.ajax({
                      url:"https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/ctb/"+routeline[index1]+"/inbound",
                      type:'GET',
                      
                      success:function(result){
  
                       for(let index in result.data){
              
                         $.ajax({
                           url:"https://rt.data.gov.hk/v1/transport/citybus-nwfb/stop/"+result.data[index].stop,
                           type:'GET',
                           
                           success:function(res){
  
                            var newdata={stopId:result.data[index].stop,lat:res.data.lat,long:res.data.long,route:routeline[index1],name:res.data.name_en};
                              console.log(newdata);
                              alldata.push(newdata);
                                       num++;
                                       if (num==229){
                                          $.ajax({
                              url:'http://csci2720.cse.cuhk.edu.hk/2011/data',
                              type:"POST",
                              data:{alldata:alldata},
                              success:function(re){
                               console.log("success!");
                               },
                               error:function(error){
                                   console.log(error);
                               }
                    }); }
                                                }
                                });
                        
                                                }
                                         }
         
                        });
                                    }//end of first for loop
                   // console.log("******************"+alldata);

                }
IdSort=()=>{
    var data=Array.from(this.state.filteredDatas);
    
        data.sort(function(a,b){  
            var x = a.arrival[0].stopId.toLowerCase();
  var y =b.arrival[0].stopId.toLowerCase();
  if (x < y) {return -1;}
  if (x > y) {return 1;}
  return 0;});


    this.setState({filteredDatas: data});
    }
NameSort=()=>{
    var data=Array.from(this.state.filteredDatas);
    
        data.sort(function(a,b){  
            var x = a.name.toLowerCase();
  var y = b.name.toLowerCase();
  if (x < y) {return -1;}
  if (x > y) {return 1;}
  return 0;});


    this.setState({filteredDatas: data});
    }
RouteSort=()=>{
        var data=Array.from(this.state.filteredDatas);
    
        data.sort(function(a,b){  
            var x = a.arrival[0].route.toLowerCase();
  var y = b.arrival[0].route.toLowerCase();
  if (x < y) {return -1;}
  if (x > y) {return 1;}
  return 0;});


    this.setState({filteredDatas: data});
    
    }
LatitudeSort=()=>{
    
        var data=Array.from(this.state.filteredDatas);
    
        data.sort(function(a,b){return a.latitude-b.latitude});


    this.setState({filteredDatas: data});
    }
LongitudeSort=()=>{
    
        var data=Array.from(this.state.filteredDatas);
    
        data.sort(function(a,b){return a.longitude-b.longitude});


    this.setState({filteredDatas: data});
    }

ClickSearchType=(type)=>{
    
    this.setState({Searchtype:type, filteredDatas:this.filterData(this.state.Searchtext,type)})
    
    }
         
         
         judgeroute=(e,text)=>{
          for (var i=0;i<e.length;i++)
          {
              if (e[i].route.toLowerCase().includes(text.toLowerCase()))
              return true;
              }
          return false;
          }        
               judgeid=(e,text)=>{
          for (var i=0;i<e.length;i++)
          {
              if (e[i].stopId.toLowerCase().includes(text.toLowerCase()))
              return true;
              }
          return false;
          }        
    filterData=(text,type)=>{
        

        
        if (type=='name')       
        return this.state.data.filter((data)=>{
                                            if (data[type].toLowerCase().includes(text.toLowerCase()))
                                                return true;
                                                return false;
                                    });
        if (type=='route')
        return this.state.data.filter((data)=>{
                                            if (this.judgeroute(data.arrival,text))
                                                return true;
                                                return false;
                                    });
          if (type=='distance')
		  return this.state.data.filter((data)=>{
			  var number = parseFloat(this.state.Searchtext);
			  console.log(number);
			  var name= data.name;
			 var distance=this.state.distanceall.find(function(value){if (value.name===name)return true; return false})
			  if (distance.distance<=number)
			  return true;
			  else
			  return false;
			  });
		    return this.state.data.filter((data)=>{
                                            if (this.judgeid(data.arrival,text))
                                                return true;
                                                return false;
                                    });
        }
    
    
    handleSearch=(e)=>
    {
       
        if (this.state.Searchtype!='Criteria')
        {
            this.setState({Searchtext:e.target.value ,filteredDatas:this.filterData(e.target.value,this.state.Searchtype)})
            }
        
        }
    
   
   
   handleLogin=(name, password)=>{
        if (name.length>=4&&name.length<=20&&password.length>=4&&password.length<=20)
        {
            $.ajax({type:'POST', data:{username:name, pwd:password}, url:"http://csci2720.cse.cuhk.edu.hk/2011/login" ,success:(res)=>{
                    if (res.login)
                {    
                    alert ("Log in succeed !");
                    
                    
                   this.setState({
            Loginout:true,  
            showLog:false,
            name:name,
            showSign:false,
            showfavorite:false
            })
        
        }
                    else
                    alert("Log in fail !");
                    
                    }})
 
        
        }
        else
        alert("The length of name and password should be 4 to 20 !");
        }
    
    handleSign=(name, password)=>{
        if (name.length>=4&&name.length<=20&&password.length>=4&&password.length<=20)
        {
            $.ajax({type:'POST', data:{username:name, pwd:password}, url:"http://csci2720.cse.cuhk.edu.hk/2011/signup" ,success:function(res){
                    if (res.signup)
                    alert ("Sign up succeed !");
                    else
                    alert("Username already exists !");
                    console.log(res.signup)
                    }})
            }
        
        else 
        alert("The length of name and password should be 4 to 20 !")
        }
    
    toggleform=()=>
    {
    
        if (this.state.showLog)
           this.setState({showLog:false,
               showSign:false
               })

           
        else
        this.setState({showLog:true,
            showSign:false

            })
        }
    
    Logout=()=>
    {
        if (confirm ("Do you want to log out?"))
     {             
         $.ajax({type:'POST', data:{}, url:"http://csci2720.cse.cuhk.edu.hk/2011/logout" ,success:function(res){
                    if (res.logout)
                    alert ("Log out succeed !");
                  //  else
                    //alert("Username already exists !");
                    //console.log(res.signup)
                    }})
        this.setState({
                    name:null,
                    password:null,
                    Loginout:false,
                    showLog:false,
                    showSign:false,
                    Searchtype:'Criteria',
                    Searchtext:''
            })
        }
        
        }
    ///////////////////////////////////////////////////for admin 
    adminlog=()=>{
	    if (this.state.Loginout==true)	
		alert("Please log out first!");
	    else
	    {
    this.test();
     $.ajax({type:'post',url:"http://csci2720.cse.cuhk.edu.hk/2011/adminLogIn",
	     success:(res)=>{this.setState({admin:true,Searchtype:'Criteria', Searchtext:''}) } })
    $.ajax({type:'GET',url:"http://csci2720.cse.cuhk.edu.hk/2011/user",success:(res)=>{this.setState({user:res});		      
	var qp=res;
        var compare2=function(x,y){
		if(x.favourite.length>y.favourite.length){
			return -1;
		}else{
			return 0;
		}
	};
        qp=qp.sort(compare2);
	var five=[];
	five.push(qp[0].username);
	five.push(qp[1].username);
        five.push(qp[2].username);
	five.push(qp[3].username);
         five.push(qp[4].username);
	var five1=[];
	     five1.push(qp[0].favourite.length);
	 five1.push(qp[1].favourite.length);
	 five1.push(qp[2].favourite.length);
	five1.push(qp[3].favourite.length);
	 five1.push(qp[4].favourite.length);
	this.setState({
	chartData2:{
		labels:five,
		datasets:[{
			label:"Favourite number",
			data:five1,
			backgroundColor:[
            'rgba(255,99,132,0.2)',
            'rgba(54,162,235,0.2)',
            'rgba(255,206,86,0.2)',
            'rgba(75,192,192,0.2)',
            'rgba(153,102,255,0.2)', 
          ]
		}]
	}
	});
	
	
	
	
	
	} });
	    }
	    
    }    
    
    addUser=()=>{

    var username=prompt("Please enter the username", "someone");
    var pwd=prompt("Please enter the password", "1111");
    var favourite=prompt("Please enter the favourite", "sleep");
   if (username!=null&&pwd!=null&&favourite!=null)
   $.ajax({
        type:'post',
        url:"http://csci2720.cse.cuhk.edu.hk/2011/user",
        data:{username:username,pwd:pwd,favourite:favourite},
        success:(res)=>{
            $.ajax({type:'GET',
                url:"http://csci2720.cse.cuhk.edu.hk/2011/user",
                success:(res)=>{
                    this.setState({user:res}) ;
                    } 
               } )
          }
            
    })
}
    actiondelete=()=>{
    
    this.setState({actiontype:'Delete'})
    }
    	actionupdata=()=>{
    
    this.setState({actiontype:'Update'})
    }
    addstop=()=>{
        var stopId=prompt("Please enter the stopid", "111111")
    var name=prompt("Please enter the stopname", "someplace");
    var latitude=prompt("Please enter the latitude", "11");
    var longitude=prompt("Please enter the longitude", "11");
   if (stopId!=null&&name!=null&&latitude!=null&&longitude!=null)
   $.ajax({
        type:'post',
        url:"http://csci2720.cse.cuhk.edu.hk/2011/stop",
        data:{stopId:stopId,name:name,latitude:latitude,longitude:longitude},
        success:(res)=>{
         alert("added successfully");
          }
            
    })
}
    
    ClickUser=()=>{
    
  
    $.ajax({type:'GET',url:"http://csci2720.cse.cuhk.edu.hk/2011/user",success:(res)=>{this.setState({user:res,showuser:true}) } })
    }
    ClickStop=()=>{
   
   $.ajax({type:'GET',url:"http://csci2720.cse.cuhk.edu.hk/2011/getdata",
        success:(res)=>{ 
           
            var x=res.filter(function(value) {if (value.latitude==null||value.arrival.length==0)return false; return true;})
         
            this.setState({data:x, filteredDatas:x,showuser:false}) 
            
            } 
        
        
        })
  
    }
    adminLogout=()=>{
        this.setState({admin:false});
            $.ajax({type:'post',url:"http://csci2720.cse.cuhk.edu.hk/2011/adminLogOut",success:(res)=>{this.setState({admin:false}) } })
        }
    
    adminRightClick=(data,type,e)=>{
        e.preventDefault();
        if(this.state.actiontype=='Delete')
      { 
          if(type=='user')
        {
           $.ajax({type:'delete', async:false,url:"http://csci2720.cse.cuhk.edu.hk/2011/user/"+data.username,success:()=>alert("delete succeed")})
        
//$.ajax({type:'GET',url:"http://localhost:3000/user",success:(res)=>{this.setState({user:res,showuser:true}) } })
    
			}
        else
        {
             $.ajax({type:'delete', url:"http://csci2720.cse.cuhk.edu.hk/2011/stop/"+data.name,success:(e)=>alert("delete succeed")})
            }
        }
		else
		{
			if(type=='user')
        {
			var username=prompt("Please enter the username", "someone");
    var pwd=prompt("Please enter the password", "1111");
    var favourite=prompt("Please enter the favourite", "sleep");
           $.ajax({type:'put', url:"http://csci2720.cse.cuhk.edu.hk/2011/user/"+data.username,
		   data:{username:username,pwd:pwd,favourite:favourite},
		   success:()=>alert("update succeed")})
            }
			
			else
        {
			var stopId=prompt("Please enter the stopid", data.arrival[0].stopId)
    var name=prompt("Please enter the stopname", data.name);
    var latitude=prompt("Please enter the latitude", data.latitude);
    var longitude=prompt("Please enter the longitude", data.longitude);
	var route=prompt("Please enter the route", data.arrival[0].route);
   if (stopId!=null&&name!=null&&latitude!=null&&longitude!=null)
       {   $.ajax({type:'put', url:"http://csci2720.cse.cuhk.edu.hk/2011/stop/"+data.name,
	   data:{stopId:stopId,name:name,latitude:latitude,longitude:longitude,route:route},
	   success:(e)=>alert("updata succeed")})
	   }
            }
		}

        }   

    ////////////////////////////////////////////////////////////////////////////

ClickSignUp=()=>{
    if (this.state.showSign)
    this.setState({
        showLog:false,
             showSign:false
        })
    else
    this.setState({
        showLog:false,
             showSign:true
        })
    }
    
    
ClickFavorite=()=>{
        
$.ajax({
    type:'GET',url:"http://csci2720.cse.cuhk.edu.hk/2011/favourite",async:false,
          success:(res)=>{
             var favorite=[];
              res.forEach((value, index, array)=>{
                  
                  $.ajax({type:'GET',url:"http://csci2720.cse.cuhk.edu.hk/2011/stop/"+value,async:false,
                      success:(stop)=>{
                          favorite.push(stop);
                          }
                          })
                      })
                  this.setState({favoritestop:favorite,showfavorite:true, showdetail:false})
                  
              
              } 
          })
 
    
    }    
	DeleteFavorite=(stopname)=>{
        
$.ajax({type:'delete',
    url:"http://csci2720.cse.cuhk.edu.hk/2011/favourite/"+stopname,
    success:()=>{
        }
    })
 
            var favorite=this.state.favoritestop.filter((value)=>{if (value.name==stopname) return false; return true});
        
        this.setState({favoritestop:favorite})
    }    
addComment=(stopname,e)=>{
    var body= prompt("Please enter the content", "good stop");
    var comment={ body: body, username: this.state.name, date: Date() }
    $.ajax({type:'POST',data:comment,
        url:"http://csci2720.cse.cuhk.edu.hk/2011/stop/"+stopname,
	    	async:false,
        success:()=>{alert("comment added");
            $.ajax({type:'GET',url:"http://csci2720.cse.cuhk.edu.hk/2011/getdata",async:false,success:(res)=>{
              var newdetail=this.state.detailstop;
              newdetail.comment.push(comment);
            this.setState({data:res, filteredDatas:res,detailstop:newdetail
            }); } })
            }
        })
    }  
LoginDefault=()=>{
    
    this.setState({showfavorite:false, showdetail:false})
    }
    
handleRightClick=(stop,e)=>{
        e.preventDefault();
               if (confirm("Do you want to know more details about stop"+stop.arrival[0].stopId+"?")==true)
               {
                   this.setState({showdetail:true,
                    detailstop:stop,
                    //map
                  CenterLoc:{lat:stop.latitude,lng:stop.longitude},
                  CenterName:stop.name,
                  showdata:[stop],
                  zoom:18,
			detailmap:true	  
                  })
                   }
        }
    BackToList=()=>{
        var temp=this.state.data;
      var compare=function(x,y){
        if(x.comment.length>y.comment.length){
          return -1;
        }else{
          return 0;
        }
      }
    var temp1=this.state.data;
     var compare1=function(x,y){
      if(x.arrival.length>y.arrival.length){
        return -1;
      }else{
        return 0;
      }
     }
     temp1=temp1.sort(compare1);
      temp=temp.sort(compare);
      var topfivename=[];
      var topfivenum=[];
      topfivename.push(temp[0].name);
      topfivename.push(temp[1].name);
      topfivename.push(temp[2].name);
      topfivename.push(temp[3].name);
      topfivename.push(temp[4].name);
      topfivenum.push(temp[0].comment.length);
      topfivenum.push(temp[1].comment.length);
      topfivenum.push(temp[2].comment.length);
      topfivenum.push(temp[3].comment.length);
      topfivenum.push(temp[4].comment.length);
      var topfivename1=[];
     var topfivenum1=[];
     topfivename1.push(temp1[0].name);
     topfivename1.push(temp1[1].name);
     topfivename1.push(temp1[2].name);
     topfivename1.push(temp1[3].name);
     topfivename1.push(temp1[4].name);
     topfivenum1.push(temp1[0].arrival.length);
     topfivenum1.push(temp1[1].arrival.length);
     topfivenum1.push(temp1[2].arrival.length);
     topfivenum1.push(temp1[3].arrival.length);
     topfivenum1.push(temp1[4].arrival.length);
    // console.log(topfivename);//done
    // console.log(topfivenum);
        this.setState({showdetail:false,
          showdata:this.state.data,
          zoom:16,
          detailmap:false,
          chartData:{
            labels:topfivename,
            datasets:[{
              label:"Comment Number",
              data:topfivenum,
              backgroundColor:[
                'rgba(255,99,132,0.2)',
                'rgba(54,162,235,0.2)',
                'rgba(255,206,86,0.2)',
                'rgba(75,192,192,0.2)',
                'rgba(153,102,255,0.2)', 
              ]
            }]
          },
          chartData1:{
            labels:topfivename1,
            datasets:[{
              label:"Route Number",
              data:topfivenum1,
              backgroundColor:[
                'rgba(255,99,132,0.2)',
                'rgba(54,162,235,0.2)',
                'rgba(255,206,86,0.2)',
                'rgba(75,192,192,0.2)',
                'rgba(153,102,255,0.2)', 
              ]
            }]
          }
        });
        }
		
DistanceSort=()=>{
	var distance=this.state.distanceall.sort(function(a,b) {return a.distance-b.distance});
	var newdata=[];
	distance.forEach((value)=>{newdata.push(this.state.filteredDatas.find(function(x){return x.name===value.name;}))})

	this.setState({filteredDatas:newdata});
	}
    maplistener=event=>{
          //event.preventDefault();
         // console.log('*****should be position'+event.latLng);
          userloc={lat:event.latLng.lat(),lng:event.latLng.lng()};
          this.setState({
            UserLoc:userloc
          });
          distancedata=[];
        for(let index in this.state.data){
          var lat1=this.state.data[index].latitude;
          var lat2=this.state.UserLoc.lat;
          var lng1=this.state.data[index].longitude;
          var lng2=this.state.UserLoc.lng;
          var R=6378137;
          var dlat=(lat1-lat2)*Math.PI/180;
          var dlng=(lng1-lng2)*Math.PI/180;
          var dlat1=lat1*Math.PI/180;
          var dlat2=lat2*Math.PI/180;
          var a=Math.sin(dlat/2)*Math.sin(dlat/2)+Math.cos(dlat1)*Math.cos(dlat1)*Math.sin(dlng/2)*Math.sin(dlng/2);
          var c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
          var d=R*c;
          distancedata.push({name:this.state.data[index].name,distance:d});
        }
        this.setState({
          distanceall:distancedata
        });
        }
    mapright=(event)=>{
      //e.preventDefault();
          
          if(!this.state.detailmap){
            centerloc={lat:event.latLng.lat(),lng:event.latLng.lng()};
            for(let index in this.state.data){
            if(this.state.data[index].latitude===event.latLng.lat()&&this.state.data[index].longitude===event.latLng.lng()){
              if (confirm("Do you want to know more details about stop "+this.state.data[index].arrival[0].stopId+"?")==true)
               {
                   this.setState({showdetail:true,
                    detailstop:this.state.data[index],
                    //map
                  CenterLoc:centerloc,
                  CenterName:this.state.data[index].name,
                  showdata:[this.state.data[index]],
                  zoom:18,
                  detailmap:true
                  })
                   }
              
              break;
            }
          }
          }
          
        }
    //新加了一句，只要不点按钮，admin一直是false，就是原界面
    
    render(){
	if (this.state.admin==false)
        return(
        	// navigation bar 
            <div>
		<nav className="navbar navbar-expand-lg navbar-light bg-light ">
			<div className="navbar-header">
		<a className="navbar-brand" href="#">BUS</a>
			</div>

			<ul className="navbar-nav">
               
			<li className="nav-item active">
		<a className="nav-link" href="#" onClick={this.LoginDefault}>Stop</a>
				</li>
				
                <li className="nav-item">              
		<a className="nav-link" href="#" onClick={this.ClickFavorite}>Favourite</a>
				</li>
          
			</ul>
			<div className="form-inline">     
          <Dropdown Searchtype={this.state.Searchtype} ClickSearchType={this.ClickSearchType}/>
	<input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={this.handleSearch}/></div>
		<a className="nav-right" >{this.state.name} </a>&nbsp;&nbsp;&nbsp;
		<a className="nav-right" ><SignUp Loginout={this.state.Loginout} ClickSignUp={this.ClickSignUp}/></a>&nbsp;&nbsp;&nbsp;
		<a className="nav-right" ><LogInOut Loginout={this.state.Loginout} toggleform={this.toggleform} Logout={this.Logout}/></a>
		</nav>

		<p></p>
		<div></div>
<button className="btn btn-primary"onClick={this.adminlog}>Click to log as admin</button>
		<Logform showLog={this.state.showLog} showSign={this.state.showSign}  handleLogin={this.handleLogin} handleSign={this.handleSign}/>

          <Stoplist distanceall={this.state.distanceall}DeleteFavorite={this.DeleteFavorite} addComment={this.addComment} favoritestop={this.state.favoritestop}  Loginout={this.state.Loginout} showfavorite={this.state.showfavorite}/>

        <Userlist/>
        <div style={{width:'100vw', height:'100vh'}}>
          <Mapcontainer showornot={this.state.Loginout}
          CenterLoc={this.state.CenterLoc}
          maplistener={this.maplistener}
          UserLoc={this.state.UserLoc}
          showdata={this.state.showdata}
          markerClick={this.mapright}
          showornot={this.state.Loginout}
          zoom={this.state.zoom}
          />
        </div>
        <div>
 <Userchart chartData={this.state.chartData} chartData1={this.state.chartData1} showornot={this.state.Loginout} showornot1={this.state.detailmap}
 />

</div>
        <StopInfo DistanceSort={this.DistanceSort}showfavorite={this.state.showfavorite} handleRightClick={this.handleRightClick} Loginout={this.state.Loginout}  showdetail={this.state.showdetail}Serchtype={this.state.Searchtype} data={this.state.filteredDatas} IdSort={this.IdSort} RouteSort={this.RouteSort} NameSort={this.NameSort} LatitudeSort={this.LatitudeSort} LongitudeSort={this.LongitudeSort} distanceall={this.state.distanceall}
        UserLoc={this.state.UserLoc} CenterLoc={this.state.CenterLoc } showdata={this.state.showdata} maplistener={this.maplistener} markerClick={this.mapright} showall={this.showAll} CenterName={this.state.CenterName}
        />
        <button onClick={this.test}></button>
        <Detail  distanceall={this.state.distanceall} addComment={this.addComment} detailstop={this.state.detailstop} Loginout={this.state.Loginout} showdetail={this.state.showdetail} BackToList={this.BackToList}/>
        </div>
        
        )
	    //新加的admin界面///////////////////////////////
else
	 return(
        <div>
        		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="navbar-header">
		<a className="navbar-brand" href="#" onClick={this.test}>Flush</a>
			</div>

			<ul className="navbar-nav">
               
			<li className="nav-item active">
		<a className="nav-link" href="#" onClick={this.ClickStop}>Stoplist</a>
				</li>
				
                <li className="nav-item">              
		<a className="nav-link" href="#" onClick={this.ClickUser}>Userlist</a>
				</li>
    
			</ul>        
                
	
		<a className="nav-right" >{this.state.name} </a>&nbsp;&nbsp;&nbsp;
		<a className="nav-right" ><SignUp Loginout={true} ClickSignUp={this.ClickSignUp}/></a>&nbsp;&nbsp;&nbsp;
		<a className="nav-right" ><LogInOut Loginout={true} toggleform={this.toggleform} Logout={this.adminLogout}/></a>
		</nav>
		 <div><Adminchart chartadmin={this.state.chartData2}/></div>
        <AdminStopInfo actiontype={this.state.actiontype} actionupdata={this.actionupdata} onContextMenu={this.adminRightClick}actiondelete={this.actiondelete}addstop={this.addstop}showuser={this.state.showuser} Serchtype={this.state.Searchtype} data={this.state.filteredDatas} IdSort={this.IdSort} RouteSort={this.RouteSort} NameSort={this.NameSort} LatitudeSort={this.LatitudeSort} LongitudeSort={this.LongitudeSort}/>
        
        <UserList  actiontype={this.state.actiontype}actionupdata={this.actionupdata} onContextMenu={this.adminRightClick}actiondelete={this.actiondelete}addUser={this.addUser}showuser={this.state.showuser} user={this.state.user}/>
<AboutProject />
		 </ div>        
        )
  ///////////////////////////////////      
        }
    
    
    
    
    }
	//About This Project
	class AboutProject extends React.Component{
	render(){
		
		return (<div><h3 className="text-info text-center">About this project</h3>
		<ol>
		<li><h5>Names and workload distribution of each group member:</h5>
<p>Main contributors:</p>
<p>LU Yijian: User location, Charting statistics, User actions</p>
<p>CHEN Haonan: User actions, Admin actions, Non-user actions</p>

<p>Assistant:</p>
<p>LI Peirong</p>
</li>
		<li><h5>Basic “how-to” of your project app:</h5>
        <ul><li><p> Install and start the application:</p>In the downloaded folder, do the following:<p>npm install;</p><p>npm run back.js;</p><p>npm start</p></li>
        <li><p>User actions:</p><p>Sign up:</p><p>Login as user:</p><p>Log out:</p><p>Add a favourite stop:</p>
        <p>Remove stop(s) from favourite list:</p><p>Get home location:</p><p>Update home location:</p></li>
        </ul>
        </li>
		<li><h5> Design of data schemas and models of your database:</h5><ul><li>Schemas:<p>User schema: username, password, favourite stop(s);</p>
        <p>Stop schema: latitude, longitude, stop name, arrival time, comments.</p>
        </li><li> Models:<p>User</p><p>Stop</p></li></ul></li>
        <li><h5>We have carefully read the article: http://www.cuhk.edu.hk/policy/academichonesty</h5></li>
		<li><h5>Technologies and frameworks/libraries in use:</h5><p>React + Express</p></li>
        
		
		</ol><table className="table table-hover">
        <thead><tr><th>Advantages</th><th>Disadvantages</th></tr></thead><tbody><tr><td>Better performance due to virtual DOM</td><td>Need to be updated constantly</td></tr><tr><td>Reusable component for later development</td><td>NA</td></tr></tbody>
        </table>
		</div>)
		
		}
}
//admin 初始界面
class AdminTablerow extends React.Component{

        constructor(props){
                super(props);
                this.state={
                
                time:"",
        }
    }


                 
    
     componentDidMount(){   

         var time="";
       //  if (this.props.arrival!=null)
       {
           $.ajax({type:'GET',
                url:"https://rt.data.gov.hk/v1/transport/citybus-nwfb/eta/CTB/"+this.props.arrival[0].stopId+"/"+this.props.arrival[0].route,
           
                success:(res)=>{
          
                    res.data.forEach((arrival)=>{time=time+arrival.eta+"||";})
        this.setState( {time:time})
                    }})
            }
    }

    render(){
             var route='';
            var stopId='###'
          //  if (this.props.arrival[0]!=null)
            //{
                stopId=this.props.arrival[0].stopId;
     this.props.arrival.forEach((data)=>{
  // time=time+"Route"+data.route+':'+data.time+" ||";
   route=route+"Route"+data.route+',';

   }
     )//}
     
     
             return(
           <tr onContextMenu={(e)=>this.props.onContextMenu(this.props.stop,'stop',e)}>
        
      <th scope="row">{stopId}</th>
      <td>{this.props.name}</td>
      <td>{this.props.latitude}</td>
      <td>{this.props.longitude}</td>
      <td>{route}</td>
      <td>{this.state.time}</td>
    </tr>)
        
        }
    }
    //admin的stop table
 class AdminStopInfo extends React.Component{
    
    render(){
        
         if (this.props.showuser==true)
           return null;
        return(
        <div className="table-responsive">
        <h1 className="text-primary text-center">Stop Information</h1>
		<h3 className="text-info text-center">Click below two button to switch function</h3>
        <h3 className="text-info text-center">Then you could rightclick the stop on table to {this.props.actiontype}</h3>
       <button className= "btn btn-lg btn-outline-danger btn-block text-uppercase" onClick={this.props.actiondelete}>Delete</button>
       <button className= "btn btn-lg btn-outline-primary btn-block text-uppercase"onClick={this.props.actionupdata}>Update</button>
       <h3 className="text-info text-center">You could click Add button to add stop</h3>
       <button className= "btn btn-lg btn-outline-success btn-block text-uppercase" onClick={this.props.addstop}>Add</button>
              <h3 className="text-info text-center">You could click Upload button to Upload stop file</h3>
                     <button className= "btn btn-lg btn-outline-primary btn-block text-uppercase">Upload</button>
        <table className="table table-hover">
  <thead className="thead-light">
    <tr>
    <th scope="col"   onClick={this.props.IdSort}>StopId(click to sort by alphabet) </th>
      <th scope="col" onClick={this.props.NameSort}>StopName(click to sort by alphabet)</th>
      <th scope="col"   onClick={this.props.LatitudeSort}>Latitude(click to sort from South to North) </th>
      <th scope="col"   onClick={this.props.LongitudeSort}>Longitude(click to sort from West to East) </th>
      <th scope="col"  onClick={this.props.RouteSort}>Route(click to sort by alphabet)</th>
      <th scope="col"  >ETA</th>
      
    </tr>
  </thead>
  <tbody>
   {
       this.props.data.map(stop=>
       <AdminTablerow  onContextMenu={this.props.onContextMenu}stop={stop} key={stop._id} name={stop.name} arrival={stop.arrival}  longitude={stop.longitude}  latitude={stop.latitude} />      
       )
   }

  </tbody>
 </table>
        </div>
        )
        
       
        }
    }
 /////admin 的userlist   
  class UserlistTable extends React.Component{
          render(){       
              var favourite='';
            
     this.props.user.favourite.forEach((data)=>{
  // time=time+"Route"+data.route+':'+data.time+" ||";
   favourite=favourite+"BusName:"+data+',';

   }
     )
           return(
                        
           <tr onContextMenu={(e)=>this.props.onContextMenu(this.props.user,'user',e)}>
        
      
      <td scope="row">{this.props.user.username}</td>
      <td>{this.props.user.pwd}</td>
      <td>{favourite}</td>

    </tr>)
    }
    }
    
class UserList extends React.Component{
    
    render(){
        console.log(this.props.showuser)
       if ( this.props.user==undefined||this.props.user==null||this.props.showuser==false)
       return null;
        return(
        <div className="table-responsive">
        <h1 className="text-primary text-center">User Information</h1>
		<h3 className="text-info text-center">Click below two button to switch function</h3>
<h3 className="text-info text-center">Then you could rightclick the User on table to {this.props.actiontype}</h3>
       <button className= "btn btn-lg btn-outline-danger btn-block text-uppercase" onClick={this.props.actiondelete}>Delete</button>
       <button className= "btn btn-lg btn-outline-primary btn-block text-uppercase" onClick={this.props.actionupdata}>Update</button>
       <h3 className="text-info text-center">You could click Add button to add User</h3>
       <button className= "btn btn-lg btn-outline-success btn-block text-uppercase" onClick={this.props.addUser}>Add</button>
        <table className="table table-hover">
  <thead className="thead-light">
    <tr>
    <th scope="col"  >Username</th>
      <th scope="col" >Password</th>
      <th scope="col"  >Favorite</th>
    </tr>
  </thead>
  <tbody>
{
    this.props.user.map((data)=><UserlistTable onContextMenu={this.props.onContextMenu} key={data._id} user={data}/>)
    }
  </tbody>
</table>
        </div>)
        
        }
    }    
////////////////////////////////////////////////////////////////////////////
class Dropdown extends React.Component{

render(){
    
    return(
<div className="btn-group btn-group-toggle btn-group-vertical" data-toggle="buttons">

    <button className="btn btn-secondary"onClick={()=>this.props.ClickSearchType('name')}>Name</button>
  <button className="btn btn-secondary"onClick={()=>this.props.ClickSearchType('route')}>Route</button>
	<button className="btn btn-secondary"onClick={()=>this.props.ClickSearchType('stopid')}>Stopid</button>
  <button className="btn btn-secondary"onClick={()=>this.props.ClickSearchType('distance')}>Distance</button>

</div>
)
}
}

class Tablerow extends React.Component{


    render(){
           
             var route='';
            
var distance=this.props.distanceall.find((value)=>{if (value.name===this.props.stop.name)return true; return false;}).distance;
     this.props.arrival.forEach((data)=>{
  // time=time+"Route"+data.route+':'+data.time+" ||";
   route=route+"Route"+data.route+',';

   }
     )
     
             return(
           <tr onContextMenu={(e)=>this.props.handleRightClick(this.props.stop,e)}>
        
      <th scope="row">{this.props.arrival[0].stopId}</th>
      <td>{this.props.name}</td>
      <td>{this.props.latitude}</td>
      <td>{this.props.longitude}</td>
      <td>{route}</td>
      <td>{distance}</td>
    </tr>)

        }
    }


//初始界面
class StopInfo extends React.Component{
    
    render(){
        if (this.props.Loginout&&this.props.showdetail==false&&this.props.showfavorite==false)
        return(
          
           
          




        <div className="table-responsive">
        <h1 className="text-primary text-center">Stop Information</h1>
        <h3 className="text-info text-center">Right Click To Get More Information</h3>
        <table className="table table-hover">
  <thead className="thead-light">
    <tr>
    <th scope="col"   onClick={this.props.IdSort}>StopId(click to sort by alphabet) </th>
      <th scope="col" onClick={this.props.NameSort}>StopName(click to sort by alphabet)</th>
      <th scope="col"   onClick={this.props.LatitudeSort}>Latitude(click to sort from South to North) </th>
      <th scope="col"   onClick={this.props.LongitudeSort}>Longitude(click to sort from West to East) </th>
      <th scope="col"  onClick={this.props.RouteSort}>Route(click to sort by alphabet)</th>
      <th scope="col"  onClick={this.props.DistanceSort}>Distance(click to sort)</th>   
      
    </tr>
  </thead>
  <tbody>
   {
       this.props.data.map(stop=>
       <Tablerow handleRightClick={this.props.handleRightClick} stop={stop} key={stop._id} name={stop.name} arrival={stop.arrival} distanceall={this.props.distanceall} longitude={stop.longitude}  latitude={stop.latitude} />
       
       )
   }

  </tbody>
</table>
        </div>
        
          
        )
        else
        return null;
        }
    }
class Mapcontainer extends React.Component{
  render(){
     if(this.props.showornot){
      return(<WrappedMap
        googleMapURL={'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBr-nrnUY_lRS365y-hr51NJlF0regruwo'}
        loadingElement={<div style={{height:'100%'}}/>}
        containerElement={<div style={{height:"100%"}}/>}
        mapElement={<div style={{height:"100%"}}/>}
        CenterLoc={this.props.CenterLoc}
        maplistener={this.props.maplistener}
        UserLoc={this.props.UserLoc}
        showdata={this.props.showdata}
        markerClick={this.props.markerClick}
        zoom={this.props.zoom}
       />);
     }
     else{
       return null;
     }

  }
}

//收藏界面
class Stoplist extends React.Component{
   
    render(){
        if(this.props.Loginout&&this.props.showfavorite)
      {  
          
         
        return(
        <div>
        {
            this.props.favoritestop.map(stop=>
            <FavoriteDetail detailstop={stop} key={stop._id} DeleteFavorite={this.props.DeleteFavorite} addComment={this.props.addComment}distanceall={this.props.distanceall}/>
            
            )}
        </div>
        )
        }
    else
return null;
}

    }

//收藏界面里的细节
class FavoriteDetail extends React.Component{
       render(){

         
        return(<div >   
        < h2 className="text-primary text-center">Brief Introduction</h2>
           <table className="table table-hover">
  <thead className="thead-light">
    <tr><th scope="col"   >StopId</th>
      <th scope="col" >StopName</th>
      <th scope="col"  >Latitude</th>
      <th scope="col"  >Longitude</th>
      <th scope="col"  >Route</th>
      <th scope="col"  >Distance</th>
         </tr>
  </thead>
  <tbody>
    <Tablerow stop={this.props.detailstop} key={this.props.detailstop._id} name={this.props.detailstop.name} arrival={this.props.detailstop.arrival} distanceall={this.props.distanceall} longitude={this.props.detailstop.longitude}  latitude={this.props.detailstop.latitude} />
    </tbody>
    </table>
              
           <h2 className="text-primary text-center">Related Route</h2>  <br/>
              <table className="table table-hover">
  <thead className="table-info">
    <tr><th scope="col"   >Route</th>
      <th scope="col" >Origin</th>
      <th scope="col"  >Dest</th>
      <th scope="col"  >Arrival time</th>
         </tr>
  </thead>
  <tbody>
   {
       this.props.detailstop.arrival.map(route=>
       <Detailtable route={route.route} stopId={route.stopId} key={route.route}  />  
       )
   }
    </tbody>
    </table>
    <h2 className="text-primary text-center">Comment({this.props.detailstop.comment.length})</h2><br />
<Comment stop={this.props.detailstop} addComment={this.props.addComment}/>
<button className="btn-primary" onClick={()=>this.props.DeleteFavorite(this.props.detailstop.name)}>delete form favorite</button>
    </div>)
    }
    }

//评论
class Comment extends React.Component{
    


    
    render(){
        

        
        if (this.props.stop.comment==null)
        return (<div><a className="text-primary">No Comment</a><button onClick={(e)=>this.props.addComment(this.props.stop.name,e)}>add</button></div>);
        return (
        <div>
               <table className="table table-hover">
  <thead className="table-success">
    <tr><th scope="col"   >Username</th>
      <th scope="col" >Body</th>
      <th scope="col"  >Date</th>

         </tr>
  </thead>
  <tbody>
   {
                                    this.props.stop.comment.map(activity=>
                                             <ActivityItem 
                                             handleRightClick={this.props.handleRightClick}
                                             key={activity.date.toString()+Math.random()}
                                             username={activity.username}
                                             time={activity.date} 
                                             content={activity.body} 
                                           
                                          
                                             />
                                    )
  
       
   }
    </tbody>
    </table>
                                
                                
                                
                                <button className="btn-info"onClick={(e)=>this.props.addComment(this.props.stop.name,e)}>add comment</button>
                            </div>
                        );
        }
    
    
    }
//评论里的table
class ActivityItem extends React.Component{
            

            
            render(){
                       
                            return(
                                      <tr>
      <th scope="row">Created by {this.props.username}</th>
      <td>{this.props.content}</td>
      <td>{this.props.time}</td> 
        </tr>)

                }
    }

//右键点击的细节
class Detail extends React.Component{
    
addfavorite=()=>{
    $.ajax({type:'PUT',url:"http://csci2720.cse.cuhk.edu.hk/2011/favourite/"+this.props.detailstop.name,
        success:(res)=>{alert("adding finished")}}
    
    )}
    render(){
        if (this.props.Loginout&&this.props.showdetail)
        {
         
        return(<div > <button className="btn btn-primary"onClick={this.props.BackToList}>Back</button>  
           <h2 className="text-primary text-center">Brief Introduction</h2>
           <table className="table table-hover">
  <thead className="thead-light">
    <tr><th scope="col"   >StopId</th>
      <th scope="col" >StopName</th>
      <th scope="col"  >Latitude</th>
      <th scope="col"  >Longitude</th>
      <th scope="col"  >Route</th>
      <th scope="col" >Distance</th>
         </tr>
  </thead>
  <tbody>
    <Tablerow stop={this.props.detailstop} key={this.props.detailstop._id} name={this.props.detailstop.name} arrival={this.props.detailstop.arrival}  distanceall={this.props.distanceall}longitude={this.props.detailstop.longitude}  latitude={this.props.detailstop.latitude} />
    </tbody>
    </table>
              
           <h2 className="text-primary text-center">Related Route</h2>   <br/>
              <table className="table table-hover">
  <thead className="table-info">
    <tr><th scope="col"   >Route</th>
      <th scope="col" >Origin</th>
      <th scope="col"  >Dest</th>
      <th scope="col"  >Arrival time</th>
         </tr>
  </thead>
  <tbody>
   {
       this.props.detailstop.arrival.map(route=>
       <Detailtable route={route.route} stopId={route.stopId} key={route.route}  />  
       )
   }
    </tbody>
    </table>
    <h2 className="text-primary text-center">Comment({this.props.detailstop.comment.length})</h2><br />
    <Comment  stop={this.props.detailstop} addComment={this.props.addComment}/>
    <button className="btn-primary" onClick={this.addfavorite}>add to favorite</button>
    </div>)
    }
        else
        return null;
        }
    }
//右键点击细节内的table
class Detailtable extends React.Component{

            constructor(props){
                super(props);
                this.state={
                
                orig:"",
                dest:"",
                time:"",
        }
    }


    
     componentDidMount(){   
          $.ajax({type:'GET',
            url:"https://rt.data.gov.hk/v1/transport/citybus-nwfb/route/CTB/"+this.props.route, 
            
            error:()=>{console.log("wrong")},
            success:(res)=>{
          this.setState( { 
              orig:res.data.orig_en,
            dest:res.data.dest_en
            })
            
            }})     
         var time="";
       $.ajax({type:'GET',
                url:"https://rt.data.gov.hk/v1/transport/citybus-nwfb/eta/CTB/"+this.props.stopId+"/"+this.props.route,
           
                success:(res)=>{
          
                    res.data.forEach((arrival)=>{time=time+arrival.eta+"||";})
        this.setState( {time:time})
                    }})
    }
    render(){     
       

 
   
        return (            
           <tr>
      <th scope="row">{this.props.route}</th>
      <td>{this.state.orig}</td>
      <td>{this.state.dest}</td>
      <td>{this.state.time}</td>

      
    </tr>)
        
        }
    
    }


class Userlist extends React.Component{
    
    render(){
        
        return(<div ></div>)
        
        }
    }



class Logform extends React.Component{
               
               constructor(props){
                super(props);
                this.state={
                  
                    name:null,
                    password:null,
        }
    } 
        nameChange=(e)=>
    {
        this.setState({name:e.target.value})
        }
       passwordChange=(e)=>
    {
        this.setState({password:e.target.value})
        }
    
    
    render(){
        if (this.props.showLog)
                      return ( 
                    <div>  <form role="form">
                       <div className="form-group">
<label>Name</label>
<input type="text" className="form-control"
         placeholder="" onChange={this.nameChange}/>
</div>
<div className="form-group">
<label>Password</label>
<input type="password" className="form-control" 
         placeholder=""onChange={this.passwordChange}/>
</div>
</form>
<button type="submit" className="btn btn-lg btn-primary btn-block text-uppercase" onClick={()=>this.props.handleLogin(this.state.name,this.state.password)}>Log In</button>
</div>
);
    else
    if (this.props.showSign)
    return(                   
    <div>  <form role="form">
                       <div className="form-group">
<label>Name</label>
<input type="text" className="form-control"
         placeholder="" onChange={this.nameChange}/>
</div>
<div className="form-group">
<label>Password</label>
<input type="text" className="form-control" 
         placeholder=""onChange={this.passwordChange}/>
</div>
</form>
<button type="submit" className="btn btn-lg btn-outline-primary btn-block text-uppercase" onClick={()=>this.props.handleSign(this.state.name,this.state.password)}>Sign Up</button>
</div>);
    return null;
    }
}


class LogInOut extends React.Component {
	  
    render() {
		if(this.props.Loginout==false) // haven't logged in
			return (
				<svg type="button" focusable="false" viewBox="0 0 512 512" width="25px"  onClick={this.props.toggleform}>
					<path fill="currentColor" d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"></path>;

                </svg>
			);
            else
		return (
        <div >
			<svg  type="button" focusable="false" viewBox="0 0 512 512" width="25px" onClick={this.props.Logout}>
				<path fill="currentColor" d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path>
			</svg>
            </div>
		);
	}
}


class SignUp extends React.Component {
	render() {
		if(this.props.Loginout==false) // haven't logged in
			return (
            
				<svg type="button" focusable="false" viewBox="0 0 640 512" width="25px" onClick={this.props.ClickSignUp}>
					<path fill="currentColor" d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
				</svg>
			);
		return null;
	}
}


/* eslint-enable */
export default class App extends React.Component{
  render(){
    return (
    <div style={{width:'100vw', height:'100vh'}}>
	  <Project />
    </div>
  );
  }
  
}


