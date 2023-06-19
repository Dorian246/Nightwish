function searchSong() {
  const lastFmApiKey = 'ae2486eddc3fc27a8e15dead1b5ea624';
  const youtubeApiKey = 'AIzaSyAjsm_rxEOqdEbaCxLYXBn4nM2VAb-BHkk'; // Reemplaza con tu propia clave de la API de YouTube
  const searchQuery = document.getElementById('search-input').value;
  const artistName = 'Nightwish';

  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artistName}&api_key=${lastFmApiKey}&format=json`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const tracks = data.toptracks.track;

      if (tracks.length > 0) {
        const searchResultsDiv = document.getElementById('search-results');
        searchResultsDiv.innerHTML = ''; // Limpiar resultados anteriores

        let foundSong = false;

        // Buscar la primera canción que coincide con la búsqueda
        for (let i = 0; i < tracks.length; i++) {
          const song = tracks[i].name;
          const artist = tracks[i].artist.name;

          if (song.toLowerCase().includes(searchQuery.toLowerCase())) {
            // Mostrar la canción encontrada
            const songElement = document.createElement('p');
            songElement.textContent = `Canción: ${song} - Artista: ${artist}`;

            searchResultsDiv.appendChild(songElement);

            // Obtener el enlace del video de YouTube
            const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(song)}%20${encodeURIComponent(artist)}&key=${youtubeApiKey}`;

            fetch(youtubeApiUrl)
              .then(response => response.json())
              .then(youtubeData => {
                if (youtubeData.items && youtubeData.items.length > 0) {
                  const videoId = youtubeData.items[0].id.videoId;
                  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

                  // Mostrar el enlace del video de YouTube
                  const videoElement = document.createElement('iframe');
                  videoElement.src = `https://www.youtube.com/embed/${videoId}`;
                  videoElement.width = '560';
                  videoElement.height = '315';

                  const videoContainer = document.getElementById('video-container');
                  videoContainer.innerHTML = ''; // Limpiar video anterior si existe
                  videoContainer.appendChild(videoElement);
                } else {
                  const noVideoElement = document.createElement('p');
                  noVideoElement.textContent = 'No se encontró ningún video para la canción.';

                  searchResultsDiv.appendChild(noVideoElement);
                }
              })
              .catch(error => {
                console.log('Error al obtener el video:', error);
              });

            foundSong = true;
            break;
          }
        }

        if (!foundSong) {
          searchResultsDiv.innerHTML = 'No se encontró la canción especificada.';
        }
      } else {
        const searchResultsDiv = document.getElementById('search-results');
        searchResultsDiv.innerHTML = 'No se encontraron canciones para el grupo especificado.';
      }
    })
    .catch(error => {
      const searchResultsDiv = document.getElementById('search-results');
      searchResultsDiv.innerHTML = `Error al buscar canciones: ${error}`;
    });
}

