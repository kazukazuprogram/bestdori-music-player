import { Component } from "react";
import "./App.css"
import next from "./img/next.svg"
import pause from "./img/pause.svg"
import play from "./img/play.svg"
import prev from "./img/prev.svg"
import loop from "./img/loop.svg"

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      songdata: "loading",
      banddata: [],
      seek: 1,
      playing: -2
      /*
      -2: 初期
      -1: ローディング
      0: 未割り当て
      1～: ID
      */
    }
    this.audio = new Audio()
    this.audio.ontimeupdate = e=>this.setState({seek: e.target.currentTime / e.target.duration})
  }

  play(id) {
    var idstr = ("00" + id).slice(-3)
    console.log(id)
    this.audio.src = `https://bestdori.com/assets/jp/sound/bgm${idstr}_rip/bgm${idstr}.mp3`
    console.log("loading")
    this.setState({playing: -1})
    this.audio.addEventListener("canplay", e=>{
      console.log("play")
      e.target.play()
      this.setState({playing: id})
    })
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
          if (d.length >= 4) continue
          const f = Math.ceil(d/10)*10
          const jack = "https://bestdori.com/assets/jp/musicjacket/musicjacket"+f+"_rip/assets-star-forassetbundle-startapp-musicjacket-musicjacket"+f+"-"+data[d].jacketImage[0]+"-jacket.png"
          var musicTitle = data[d].musicTitle[0]||data[d].musicTitle[1]
          list.push((
            <dev
              className="songcard"
            >
              <div className="over" data-id={d} onClick={e=>this.play(e.target.getAttribute("data-id"))}/>
              <div className="backContainer">
                <div className="left">
                  <img src={jack} loading="lazy" alt={`${musicTitle} jacketimage`}/>
                </div>
                <div className="right">
                  <div className="musicTitle">{musicTitle}</div>
                  <div className="bandName">{banddata[data[d].bandId].bandName[0]}</div>
                </div>
              </div>
            </dev>
          ))
        }
        this.setState({songdata: list.reverse()})
      });
    })
  }

  render() {
    return (
      <div className="App">
        <div className="Header"></div>
        <div className="Container">
          {this.state.songdata}
        </div>
        <div className="Footer">
          <div className={"seekbar " + (this.state.playing!==-1||"loading")} style={{
            width: `${this.state.seek * 100}%`,
            "background-color": this.state.playing===-1&&"gray"||"red"
          }}/>
          <div className="controller">
            <img className="prev" src={prev} />
            <img className="pause" src={pause} />
            <img className="play" src={play} />
            <img className="next" src={next} />
            <img className="loop" src={loop} />
          </div>
        </div>
      </div>
    );
  }
}
