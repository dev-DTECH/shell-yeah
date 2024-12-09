import database from "../database";

export async function getTanks(req, res) {
    try {
        const userId = req.user.id;
        const tank = database.query("SELECT * FROM tank WHERE userId = ?", [userId], (error, results, fields) => {
            if (error) {
                res.status(500).json({error: error.message});
                return;
            }
            res.status(200).json({message: "Tanks retrieved successfully", data: results});
        });
        res.status(200).json({tank, message: "Tanks retrieved successfully"});
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
}

// export async function getTanks(req, res) {
//     try {
//         const userId = req.user.id;
//         const tank = database.query("SELECT * FROM tank WHERE userId = ?", [userId], (error, results, fields) => {
//             if (error) {
//                 res.status(500).json({error: error.message});
//                 return;
//             }
//             res.status(200).json({message: "Tanks retrieved successfully", data: results});
//         });
//         res.status(200).json({tank, message: "Tanks retrieved successfully"});
//     } catch (error) {
//         res.status(error.response.status).json(error.response.data);
//     }
// }