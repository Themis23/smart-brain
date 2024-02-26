import React , {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImangeLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import ParticlesBg from 'particles-bg'
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const initialState = {
  input:"",
  imageUrl: "",
  box:{},
  route:"signin",
  isSignedIn: false,
  user: {
    id:"",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
}

class App extends Component {
  constructor(){
    super()
    this.state = initialState
  } 

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    console.log(clarifaiFace)
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol:clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col *width),
      bottomRow: height - (clarifaiFace.bottom_row*height)
    }
     
  }

  dispayFaceBox = (box) =>{
    this.setState({box: box})
  }
  loadUser =(user) =>{
    this.setState({
      user:{
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined
    },imageUrl: ""
  })
  }

  onInputChange=(event)=>{
    this.setState({input: event.target.value})
  }
  onButtonSubmit = () =>{
    this.setState({imageUrl:this.state.input})
    fetch('https://smart-brain-api-nxc5.onrender.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          })
    .then(response =>response.json())
    .then(response => {
      if (response) {
        fetch('https://smart-brain-api-nxc5.onrender.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          id: this.state.user.id
          })
        })
          .then(response =>response.json())
          .then(count =>{
            this.setState(Object.assign(this.state.user,{entries:count}))
          })
          .catch(console.log)
        }
        this.dispayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(error => console.log('error', error));
  }
  onRouteChange =(route) =>{
    if(route === "signout"){
      this.setState(initialState)
    }else if (route === "home"){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }

  render(){
    const {isSignedIn,imageUrl,route,box} = this.state
    return (
      <div className="App">
        <ParticlesBg className="particles" color='#ffffff' num={120} type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" 
        ?<div>
          <Logo />
          <Rank name = {this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm 
            onInputChange = {this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition box = {box} imageUrl={imageUrl}/>
        </div>
        :(
          route === "signin"
            ?<Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
    }
      </div>
    );
  }

}
export default App;
