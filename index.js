import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// initialize middleware('s)
app.use(express.json());
app.use(cors());

// define POST route for /events - listen to events emmitted from event_bus
app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const comment = data.comment;
    // validate comment
    const status = comment.includes("orange") ? "rejected" : "approved";

    // emit CommentModerated event
    axios
      .post("http://event-bus-srv:4010/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          comment: data.comment,
        },
      })
      .catch(console.error);
  }

  return res.sendStatus(204);
});

const PORT = process.env.PORT || 4014;

app.listen(PORT, () => {
  console.info("[MODERATION SERVICE]: running on port %d", PORT);
});
