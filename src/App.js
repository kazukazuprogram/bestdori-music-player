import { Component } from "react";
import "./App.css"

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      songdata: "loading",
      banddata: [],
    }
    this.audio = new Audio()
    this.audio.oncanplay = ()=>{this._play()}
  }

  componentDidMount() {
    fetch('https://bestdori.com/api/bands/all.1.json')
    .then(response_ => response_.json())
    .then(banddata=>{
      fetch('https://bestdori.com/api/songs/all.5.json')
      .then(response => response.json())
      .then(data => {
        var list = []
        for (var d in data) {
          const f = Math.ceil(d/10)*10
          const jack = "https://bestdori.com/assets/jp/musicjacket/musicjacket"+f+"_rip/assets-star-forassetbundle-startapp-musicjacket-musicjacket"+f+"-"+data[d].jacketImage[0]+"-jacket.png"
          list.push((
            <dev className={"songcard"}>
              <div className={"overlay music-" + d}
                onClick={(e)=>{
                  this.play(e.target.className.match(/ music-([0-9]+)/)[1])
                }}
              ></div>
              <div className="left">
                <img src={jack}/>
              </div>
              <div className="right">
                <div className="musicTitle">{data[d].musicTitle[0]||data[d].musicTitle[1]}</div>
                <div className="bandName">{banddata[data[d].bandId].bandName[0]}</div>
              </div>
            </dev>
          ))
        }
        this.setState({songdata: list})
      });
    })
  }

  play(id) {
    var id_3 = ("00"+id).slice(-3)
    var url = "https://bestdori.com/assets/jp/sound/bgm"+id_3+"_rip/bgm"+id_3+".mp3"
    if (this.audio.currentSrc == url) {
      return this._play()
    } else {
      this.audio.src = url
      this.audio.load()
    }
  }

  _play() {
    this.audio.play()
  }

  render() {
    return (
      <div className="App">
        <div className="Header"></div>
        <div className="Container">
          {this.state.songdata}
        </div>
        <div className="Footer"></div>
      </div>
    );
  }
}
