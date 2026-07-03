const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { createPoll } = require("../pollStore");
const { buildPresenceEmbed } = require("../buildPresenceEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("presence")
    .setDescription("Lance un appel de présence")
    .addStringOption((opt) =>
      opt
        .setName("heure")
        .setDescription("Heure du rendez-vous, ex: 21H30")
        .setRequired(true)
    ),

  async execute(interaction) {
    const time = interaction.options.getString("heure");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("presence_present")
        .setLabel("Présent")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("presence_late")
        .setLabel("En retard")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("presence_absent")
        .setLabel("Absent")
        .setStyle(ButtonStyle.Danger)
    );

    // Placeholder poll object just to render the first empty embed
    const placeholder = {
      time,
      creatorTag: interaction.user.tag,
      present: new Map(),
      late: new Map(),
      absent: new Map(),
    };

    const message = await interaction.reply({
      embeds: [buildPresenceEmbed(placeholder)],
      components: [row],
      fetchReply: true,
    });

    createPoll(message.id, {
      time,
      creatorTag: interaction.user.tag,
      channelId: interaction.channelId,
      guildId: interaction.guildId,
    });
  },
};
