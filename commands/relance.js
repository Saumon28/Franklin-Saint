const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");
const { getPoll, getRespondedIds } = require("../pollStore");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("relance")
    .setDescription("Envoie un DM à tous ceux qui n'ont pas encore répondu à l'appel")
    .addStringOption((opt) =>
      opt
        .setName("message_id")
        .setDescription("ID du message de présence (clic droit > Copier l'ID)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const messageId = interaction.options.getString("message_id");
    const poll = getPoll(messageId);

    if (!poll) {
      return interaction.reply({
        content: "Je ne trouve pas de sondage de présence avec cet ID.",
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const guild = interaction.guild;
    // Requires the "Server Members Intent" enabled in the dev portal,
    // and GatewayIntentBits.GuildMembers in index.js
    const members = await guild.members.fetch();
    const responded = getRespondedIds(poll);

    const messageLink = `https://discord.com/channels/${poll.guildId}/${poll.channelId}/${messageId}`;

    let sent = 0;
    let failed = 0;

    for (const [id, member] of members) {
      if (member.user.bot) continue;
      if (responded.has(id)) continue;

      try {
        await member.send(
          `👋 Tu n'as pas encore répondu à l'appel de présence de **${poll.time}**.\n` +
            `Merci de voter ici : ${messageLink}`
        );
        sent++;
      } catch (err) {
        // Fails if the user has DMs closed to server members
        failed++;
      }
    }

    await interaction.editReply(
      `Relance envoyée : ${sent} DM(s) envoyé(s), ${failed} échec(s) (DMs fermés).`
    );
  },
};
