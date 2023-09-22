// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      this.#list.find((track) => track.id === id) || null
    )
  }
}

Track.create(
  'Little something',
  'Sting and Melody Gardot',
  'https://picsum.photos/92/92/?random=1',
)

Track.create(
  'The Nearness of You',
  'Nora Jones',
  'https://picsum.photos/92/92/?random=2',
)

Track.create(
  'A Thousand Kisses Deep',
  'Leonard Cohen',
  'https://picsum.photos/92/92/?random=3',
)

Track.create(
  'Signals',
  'Zalagasper',
  'https://picsum.photos/92/92/?random=4',
)

Track.create(
  'Wonderful Tonight',
  'Eric Clapton',
  'https://picsum.photos/92/92/?random=5',
)

Track.create(
  '15 dias 500 noches',
  'Joaquin Sabina',
  'https://picsum.photos/92/92/?random=6',
)

console.log(Track.getList())

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/92/92/'
  }

  // el metodo static para hacer un objeto de la lista y añadir lo a la #list

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  // el metodo static para tener toda la lista de los track y se devolven desde el final(reverse)
  static getLIst() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  addTrackById(trackId) {
    const track = Track.getList().find(
      (track) => track.id === trackId,
    )

    if (track) {
      this.tracks.push(track)
    }
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }
}

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  // comprobamos si es isMix con !!
  const isMix = !!req.query.isMix

  console.log(isMix)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/spotify-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // entendemos si es isMix
  const isMix = !!req.query.isMix

  // sacamos el nombre name
  const name = req.body.name

  // comprobamos si no hay nombre sacamos alert
  if (!name) {
    // siempre hay que poner return
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        // se hace la comprobacion si es isMix , si es asi mandamos a otra pagina sino la dejamos en esta
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  // si hay isMix hacemos el playlist
  if (isMix) {
    Playlist.makeMix(playlist)
  }
  // saco este playlist
  console.log(playlist)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-playlist', function (req, res) {
  // res.render генерує нам HTML сторінку
  // sacamos el id del track
  const id = Number(req.query.id)

  // obtenemos con el id el playlist
  const playlist = Playlist.getById(id)

  // comprobacion si no hay el playlist
  if (!playlist) {
    return res.render(`alert`, {
      style: `alert`,

      data: {
        message: `Помилка`,
        info: `Такого плейліста не знайдено`,
        link: `/`,
      },
    })
  }

  // si hay el playlist
  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-track-delete', function (req, res) {
  // res.render генерує нам HTML сторінку

  // obtiene el id de playlist
  const playlistId = Number(req.query.playlistId)

  // obtiene el track por el id
  const trackId = Number(req.query.trackId)

  // obtenemos la lista de tracks escojidos
  const playlist = Playlist.getById(playlistId)

  // si no hay playlist escojido

  if (!playlist) {
    return res.render(`alert`, {
      style: `alert`,

      data: {
        message: `Помилка`,
        info: `Плейліст не існує`,
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  // filtramos(eleminamos los track)
  playlist.deleteTrackById(trackId)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-playlist-add', function (req, res) {
  // res.render генерує нам HTML сторінку
  // sacamos el id del playlistId
  const playlistId = Number(req.query.playlistId)

  // sacamos el id del trackId
  const trackId = Number(req.query.trackId)

  // obtenemos  el playlist de los tracks
  const playlist = Playlist.getById(id)

  // comprobacion si no hay el playlist
  if (!playlist) {
    return res.render(`alert`, {
      style: `alert`,

      data: {
        message: `Помилка`,
        info: `Такого плейліста не знайдено`,
        link: `/`,
      },
    })
  }

  // si hay el playlist
  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
