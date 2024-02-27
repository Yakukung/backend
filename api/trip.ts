import express from "express";
import { conn, queryAsync } from "../dbconnect";
import { mysql } from "../dbconnect"
import { TripPostRequest } from "../model/trip.post.req";
export const router = express.Router();

// router.get("/:idx?", (req, res) => {
//     const { idx } = req.params;
//     // ตรวจสอบว่าระบุ idx หรือไม่
//     if (idx) {
//       // กรณีระบุ idx ให้ค้นหาข้อมูลเฉพาะ idx ที่ระบุ
//       conn.query('SELECT * FROM trip WHERE idx = ?', [idx], (err, result, fields) => {
//         if (err) {
//           console.error(err);
//           res.status(500).json({ error: 'Internal Server Error' });
//           return;
//         }
//         // ตรวจสอบว่ามีข้อมูลหรือไม่
//         if (result.length === 0) {
//           res.status(404).json({ error: 'Not Found' });
//         } else {
//           res.json(result[0]);
//         }
//       });
      
//     }else {
//       // กรณีไม่ระบุ idx ให้แสดงข้อมูลทั้งหมด
//       conn.query('SELECT * FROM trip', (err, result, fields) => {
//         if (err) {
//           console.error(err);
//           res.status(500).json({ error: 'Internal Server Error' });
//           return;
//         }
//         res.json(result);
//       });
//     }
//   });

// router.get("/:id", (req, res) => {
//     let id = +req.params.id;
//     conn.query("select * from trip where idx = ?" , [id], (err, result, fields) => {
//     if (err) throw err;
//       res.json(result);
//     }
//     );
//   });

//คันหาทั้งชื่อ ทั้งเลข
  router.get("/search/fields", (req, res) => {
    conn.query(
      "select * from trip where (idx IS NULL OR idx = ?) OR (name IS NULL OR name like ?)",
      [ req.query.id, "%" + req.query.name + "%"],
      (err, result, fields) => {
      if (err) throw err;
        res.json(result);
      }
    );
  });
  router.post("/", (req, res) => {
    let trip: TripPostRequest = req.body;
    let sql =
      "INSERT INTO `trip`(`name`, `country`, `destinationid`, `coverimage`, `detail`, `price`, `duration`) VALUES (?,?,?,?,?,?,?)";
    sql = mysql.format(sql, [
      trip.name,
      trip.country,
      trip.destinationid,
      trip.coverimage,
      trip.detail,
      trip.price,
      trip.duration,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });
  


router.delete("/:id", (req, res) => {
  let id = +req.params.id;
  console.log("delete ID:", id);
  conn.query("delete from trip where idx = ?", [id], (err, result) => {
     if (err) throw err;
     res
       .status(200)
       .json({ affected_row: result.affectedRows });
  });
});

// router.put("/:id", (req, res) => {
//   let id = +req.params.id;
//   let trip: TripPostRequest = req.body;
//   let sql =
//     "update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
//   sql = mysql.format(sql, [
//     trip.name,
//     trip.country,
//     trip.destinationid,
//     trip.coverimage,
//     trip.detail,
//     trip.price,
//     trip.duration,
//     id
//   ]);
//   conn.query(sql, (err, result) => {
//     if (err) throw err;
//     res
//       .status(201)
//       .json({ affected_row: result.affectedRows });
//   });
// });

router.put("/:id", async (req, res) => {
  let id = +req.params.id;
  let trip: TripPostRequest = req.body;
  let tripOriginal: TripPostRequest | undefined;

  let sql = mysql.format("select * from trip where idx = ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  tripOriginal = rawData[0] as TripPostRequest;
  console.log(tripOriginal);

  let updateTrip = {...tripOriginal, ...trip};
  console.log(trip);
  console.log(updateTrip);

    sql =
      "update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
    sql = mysql.format(sql, [
      updateTrip.name,
      updateTrip.country,
      updateTrip.destinationid,
      updateTrip.coverimage,
      updateTrip.detail,
      updateTrip.price,
      updateTrip.duration,
      id,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res.status(201).json({ affected_row: result.affectedRows });
    });
});

















// router.get("/", (req, res) => {
//     conn.query('select * from trip', (err, result, fields)=>{
//       res.json(result);
//     });
//   });


//   router.get("/:idx", (req, res) => {
//     const { idx } = req.params;
  
//     conn.query('SELECT * FROM trip WHERE idx = ?', [idx], (err, result, fields) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//         return;
//       }
  
//       // ตรวจสอบว่ามีข้อมูลหรือไม่
//       if (result.length === 0) {
//         res.status(404).json({ error: 'Not Found' });
//       } else {
//         res.json(result[0]);
//       }
//     });
//   });














// router.get("/", (req, res) => {
//   res.send("Get in trip.ts");
// });

// // router.get("/:id", (req, res) => {
// //     if(req.query.id){
// //         const id = req.query.id;
// //         const name = req.query.name;
// //         res.send(`Get in trip.ts Query id: ${id} ${name}`);
// //     } else {
// //         conn.query('select * from trip', (err, result, fields)=>{
// //             if(err){
// //                 res.json(err);
// //             }else{
// //                 res.json(result);
// //             } 
// //         });
// //       }
// // });
// //trip Post
// // router.post("/", (req, res) => {
// //     const body = req.body;
// //     res.status(201);
// //     // res.send("Method POST in trip.ts with: "+ 
// //     // JSON.stringify(body));
// //     res.json(body);
// // });


// router.post("/", (req, res) => {
//     let body = req.body; 
//     res.send("Get in trip.ts body: " + JSON.stringify(body));
//   });

//   //get  trips from database