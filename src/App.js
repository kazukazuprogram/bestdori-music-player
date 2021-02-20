import { Component } from "react";
import "./App.css"
import LoadingLogo from "./assets/loading.svg"
import PlayLogo from "./assets/play.svg"
import PauseLogo from "./assets/pause.svg"

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
    this.onplay = props.onplay
  }

  play(id) {
    this.onplay(this.state)
    var id_3 = ("00"+id).slice(-3)
    var url = "https://bestdori.com/assets/jp/sound/bgm"+id_3+"_rip/bgm"+id_3+".mp3"
    if (this.audio.currentSrc !== url) {
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
          <img alt="" src={this.state.jacket_url}/>
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
      <img alt="" src={LoadingLogo} width="100px" height="100px"/>
    </div>
  )
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      songdata: <LoadingScreen />,
      fetched_songdata: undefined,
      fetched_banddata: undefined,
      npJacketURL: undefined,
      npTitle: undefined,
      npArtist: undefined,
      nowPlaying: false,
      isOnPlay: false
    }
    this.audio = new Audio()
    this.audio.oncanplay = ()=>{
      this.setState({
        nowPlaying: true,
        isOnPlay: true
      })
      this._play()
    }
    this.audio.onended = ()=>{
      this.setState({nowPlaying: false})
    }
    this.audio.onpause = ()=>{
      this.setState({nowPlaying: false})
    }
    this.audio.onplay = ()=>{
      this.setState({
        nowPlaying: true,
        isOnPlay: true
      })
    }
  }

  _play() {
    this.setState({
      nowPlaying: true,
      isOnPlay: true
    })
    this.audio.play()
  }

  _pause() {
    this.setState({nowPlaying: false})
    this.audio.pause()
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
          onplay={e=>{
            this.setState({
              npJacketURL: e.jacket_url,
              npTitle: e.title,
              npArtist: e.artist
            })
          }}
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
          <div className="footerContainer"
            style={{
              visible: (this.state.nowPlaying&&"hidden")||"visible"
            }}
          >
            <div className="image">
              <img alt="" src={this.state.npJacketURL} style={{
                visibility: (this.state.npJacketURL&&"visible")||"hidden",
              }}/>
              <div className="overlay" style={{
                visibility: (this.state.npJacketURL&&"visible")||"hidden",
              }}
              onMouseDown={()=>{
                if (this.state.nowPlaying) {
                  this._pause()
                } else {
                  this._play()
                }
              }}>
                <img src={(this.state.nowPlaying&&PauseLogo)||PlayLogo} alt="" className="play-pause-button"
                  style={{
                    visible: (this.state.nowPlaying&&"hidden")||"visible"
                  }}
                />
              </div>
            </div>
            <div className="info">
              <div className="npTitle">
                {this.state.npTitle}
              </div>
              <div className="npArtist">
                {this.state.npArtist}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
