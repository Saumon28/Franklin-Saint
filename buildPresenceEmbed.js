const { EmbedBuilder } = require("discord.js");

function listOrDash(map) {
  if (map.size === 0) return "—";
  return [...map.keys()].map((id) => `<@${id}>`).join("\n");
}

function buildPresenceEmbed(poll) {
  const totalResponses = poll.present.size + poll.late.size + poll.absent.size;

  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle(`📍 Présence ${poll.time}`)
    .addFields(
      {
        name: `✅ Présents (${poll.present.size})`,
        value: listOrDash(poll.present),
        inline: true,
      },
      {
        name: `🕐 En retard (${poll.late.size})`,
        value: listOrDash(poll.late),
        inline: true,
      },
      {
        name: `❌ Absents (${poll.absent.size})`,
        value: listOrDash(poll.absent),
        inline: true,
      },
      {
        name: "👥 Total",
        value:
          `✅ Présents : **${poll.present.size}**\n` +
          `🕐 En retard : **${poll.late.size}**\n` +
          `❌ Absents : **${poll.absent.size}**\n` +
          `📊 Réponses : **${totalResponses}**`,
      }
    )
    .setFooter({ text: `Presence Bot • Créé par ${poll.creatorTag}` });

  return embed;
}

module.exports = { buildPresenceEmbed };
