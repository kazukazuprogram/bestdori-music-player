import { Component } from "react";
import "./App.css"
import LoadingLogo from "./loading.svg"

class SongCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
      artist: props.artist,
      id: props.id,
      jacket_url: props.jacket_url,
    }
    this.audio = props.audio
  }

  play(id) {
    var id_3 = ("00"+id).slice(-3)
    var url = "https://bestdori.com/assets/jp/sound/bgm"+id_3+"_rip/bgm"+id_3+".mp3"
    if (this.audio.currentSrc != url) {
      document.title = `${this.state.title} - ${this.state.artist}`
      this.audio.src = url
      this.audio.load()
    }
  }

  render() {
    return (
      <dev className={"songcard"} key={`songcard-${this.state.id}`}>
        <div className={"overlay music-" + this.state.id}
          onClick={(e)=>{
            this.play(e.target.className.match(/ music-([0-9]+)/)[1])
          }}
        ></div>
        <div className="left">
          <img src={this.state.jacket_url}/>
        </div>
        <div className="right">
          <div className="musicTitle">{this.state.title}</div>
          <div className="bandName">{this.state.artist}</div>
        </div>
      </dev>
    )
  }
}

function LoadingScreen() {
  return (
    <div className="loading">
      <img src={LoadingLogo} width="100px" height="100px"/>
    </div>
  )
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      songdata: (<LoadingScreen />),  // componentのlist
      fetched_songdata: undefined,
      fetched_banddata: undefined
    }
    this.audio = new Audio()
    this.audio.oncanplay = ()=>{
      this._play()
    }
  }

  _play() {
    this.audio.play()
  }

  updateSongCardContainerWithSearch(q="") {
    var list = []
    var data = this.state.fetched_songdata
    var banddata = this.state.fetched_banddata
    for (var d in data) {
      const f = Math.ceil(d/10)*10
      const jack = "https://bestdori.com/assets/jp/musicjacket/musicjacket"+f+"_rip/assets-star-forassetbundle-startapp-musicjacket-musicjacket"+f+"-"+data[d].jacketImage[0]+"-jacket.png"
      const title = data[d].musicTitle[0]||data[d].musicTitle[1]
      const artist = banddata[data[d].bandId].bandName[0]
      const id = d
      if (!!title.match(new RegExp(q, "i"))||!!artist.match(new RegExp(q, "i"))) {
        list.push((<SongCard
          id={id}
          key={id}
          title={title}
          artist={artist}
          jacket_url={jack}
          audio={this.audio}
          />))
        }
      }
      this.setState({songdata: list})
    }

  componentDidMount() {
    fetch('https://bestdori.com/api/bands/all.1.json')
    .then(response_ => response_.json())
    .then(banddata=>{
      this.setState({fetched_banddata: banddata})
      fetch('https://bestdori.com/api/songs/all.5.json')
      .then(response => response.json())
      .then(data => {
        this.setState({fetched_songdata: data})
        this.updateSongCardContainerWithSearch()
      });
    })
  }

  render() {
    return (
      <div className="App">
        <div className="Header">
          <div className="searchForm">
            <form
              onSubmit={e=>{
                e.preventDefault()
                this.updateSongCardContainerWithSearch(e.target.query.value)
              }}
              onChange={e=>{
                e.preventDefault()
                this.updateSongCardContainerWithSearch(e.target.value)
              }}
              >
              <input name="query" type="text" />
            </form>
          </div>
        </div>
        <div className="Container">
          <div className="songCardContainer">
            {this.state.songdata}
          </div>
        </div>
        <div className="Footer">
        </div>
      </div>
    );
  }
}
