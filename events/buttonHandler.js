const { setVote, getPoll } = require("../pollStore");
const { buildPresenceEmbed } = require("../buildPresenceEmbed");
const { MessageFlags } = require("discord.js");

const BUTTON_TO_STATUS = {
  presence_present: "present",
  presence_late: "late",
  presence_absent: "absent",
};

async function handleButton(interaction) {
  const status = BUTTON_TO_STATUS[interaction.customId];
  if (!status) return;

  const messageId = interaction.message.id;
  const poll = getPoll(messageId);

  if (!poll) {
    return interaction.reply({
      content: "Ce sondage n'est plus actif (le bot a peut-être redémarré).",
      flags: MessageFlags.Ephemeral,
    });
  }

  setVote(messageId, interaction.user.id, interaction.user.username, status);

  await interaction.update({
    embeds: [buildPresenceEmbed(poll)],
  });
}

module.exports = { handleButton };
