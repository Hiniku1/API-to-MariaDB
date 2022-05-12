import fetch from "node-fetch"
import mariadb from "mariadb"

const pool = mariadb.createPool({
  host: 'localhost', 
  user:'hiniku', 
  password: 'obviousthings',
  database: 'ApollosWill',
  connectionLimit: 5
});


fetch('https://kitsu.io/api/graphql', {
  method: 'POST',
  body: JSON.stringify({
    query: `
    query anime($id: ID!) {
        findAnimeById(id: $id) {
          id
          slug
          description
          titles {
            localized
            alternatives
          }
          startDate
          endDate
          averageRatingRank
          subtype
          status
    
          posterImage {
            original {
              url
            }
          }
          bannerImage {
            original {
              url
            }
          }
    
          episodeCount
        }
      }`
      ,
    variables: {
      id: 6711
    }
  }),
  headers: {
      'content-type': 'application/json'
  }
}).then(async (data) => {
    // Console log our return data
    const idk = await data.json()
    
    

    async function runSeed() {
      let conn;
      try {
        conn = await pool.getConnection();
        
        console.log(idk.data.findAnimeById.titles.alternatives)

        const res = await conn.query("INSERT INTO Anime (id, slug, synopsis, en_title, en_jp_title, ja_jp_title, start_date, end_date, rating_rank, subtype, status, poster_image, cover_image, episode_count) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?)", [idk.data.findAnimeById.id, idk.data.findAnimeById.slug, idk.data.findAnimeById.description.en, idk.data.findAnimeById.titles.localized.en, idk.data.findAnimeById.titles.localized.en_jp, idk.data.findAnimeById.titles.localized.ja_jp, idk.data.findAnimeById.startDate, idk.data.findAnimeById.endDate, idk.data.findAnimeById.averageRatingRank, idk.data.findAnimeById.subtype, idk.data.findAnimeById.status, idk.data.findAnimeById.posterImage.original.url, idk.data.findAnimeById.bannerImage.original.url, idk.data.findAnimeById.episodeCount]);
        console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
        
        console.log(err)
    
      } catch (err) {
        throw err;
      } finally {
        if (conn) return conn.end();
      }
    
      await pool.end()
    }
    
    runSeed()

});




