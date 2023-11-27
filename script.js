let obrasInfo = [];
let puentesInfo = [];

const conseguirObras = () => {
  return fetch('https://www.datos.gov.co/resource/g373-n3yy.json')
    .then(response => response.json())
    .then(obras => {
      //console.log(obras);

      obras.forEach(obra => {
        let obraInfo = {
          posicion: { lat: obra.punto.coordinates[1], lng: obra.punto.coordinates[0] },
          nombre: obra.nombre_sede
        };

        obrasInfo.push(obraInfo);
      });
    })
    .then(conseguirPuentes)
    .catch(error => {
      console.error("Error al obtener obras:", error);
    });
};

const conseguirPuentes = () => {
  return fetch('https://books-tsfn.onrender.com/Obras')
    .then(response => response.json())
    .then(puentes => {
      //console.log(puentes);

      puentes.forEach(puente => {
        let puenteInfo = {
          posicion: { lat: puente.punto.coordinates[1], lng: puente.punto.coordinates[0] },
          nombre: puente.NombreProy
        };

        puentesInfo.push(puenteInfo);
      });
    })
    .then(miUbicacion)
    .catch(error => {
      console.error("Error al obtener puentes:", error);
    });
};

const miUbicacion = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(usuarioUbicacion => {
      let ubicacion = {
        lat: usuarioUbicacion.coords.latitude,
        lng: usuarioUbicacion.coords.longitude
      };
      console.log(ubicacion);
      crearMapaYUbicar(ubicacion).then(() => console.log("Operaciones completadas."));
    });
  }
};

const crearMapaYUbicar = (obj) => {
  const icon1 = {
    url: "img/icono_negro.png",
    scaledSize: new google.maps.Size(30, 30)
  };

  const icon2 = {
    url: "img/obras.png",
    scaledSize: new google.maps.Size(30, 30)
  };

  return new Promise((resolve, reject) => {
    let mapa = new google.maps.Map(document.getElementById('map'), {
      center: obj,
      zoom: 4
    });

    let marcadorUsuario = new google.maps.Marker({
      position: obj,
      title: 'Tu ubicacion'
    });

    marcadorUsuario.setMap(mapa);

    let marcadores = obrasInfo.map(obra => {
      let marker = new google.maps.Marker({
        position: obra.posicion,
        title: obra.nombre,
        map: mapa,
        icon: icon1
      });

      // Add click event listener to the marker
      marker.addListener('click', () => {
        // Show a popup with the message when the marker is clicked
        const infoWindow = new google.maps.InfoWindow({
          content: obra.nombre
        });
        infoWindow.open(mapa, marker);
      });

      return marker;
    });

    let marcadores2 = puentesInfo.map(puente => {
      let marker = new google.maps.Marker({
        position: puente.posicion,
        title: puente.nombre,
        map: mapa,
        icon: icon2
      });

      // Add click event listener to the marker
      marker.addListener('click', () => {
        // Show a popup with the message when the marker is clicked
        const infoWindow = new google.maps.InfoWindow({
          content: 'Hola'
        });
        infoWindow.open(mapa, marker);
      });

      return marker;
    });

    resolve();
  });
};

conseguirObras();