// Very simple in-memory store: messageId -> poll data.
// NOTE: this resets if the bot restarts. If you need votes to survive
// restarts, swap this Map for a small SQLite/JSON file later.

const polls = new Map();

function createPoll(messageId, { time, creatorTag, channelId, guildId }) {
  polls.set(messageId, {
    time,
    creatorTag,
    channelId,
    guildId,
    // userId -> displayName, so we can render mentions correctly
    present: new Map(),
    late: new Map(),
    absent: new Map(),
  });
}

function getPoll(messageId) {
  return polls.get(messageId);
}

// Moves a user into the chosen status, removing them from the other two.
function setVote(messageId, userId, displayName, status) {
  const poll = polls.get(messageId);
  if (!poll) return null;

  poll.present.delete(userId);
  poll.late.delete(userId);
  poll.absent.delete(userId);
  poll[status].set(userId, displayName);

  return poll;
}

// Everyone who has clicked ANY button (present, late, or absent-by-choice)
function getRespondedIds(poll) {
  return new Set([
    ...poll.present.keys(),
    ...poll.late.keys(),
    ...poll.absent.keys(),
  ]);
}

module.exports = { createPoll, getPoll, setVote, getRespondedIds };
