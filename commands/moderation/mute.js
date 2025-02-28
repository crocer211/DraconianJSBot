const Discord = require("discord.js");
const ms = require("ms");
const fs = require("fs");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
	const tomute = message.mentions.users.first();
	const notice3 = new Discord.MessageEmbed()
		.setDescription(
			"<:cross1:747728200691482746> **I don't have permission to mute people!**"
		)
		.setColor("RED");
	if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) {
		return message.channel.send(notice3).then(m => m.delete({ timeout: 5000 }));
	}

	//! tempmute @user 1s/m/h/d
	const embed6 = new Discord.MessageEmbed()
		.setDescription(
			`:no_entry_sign: ${message.author.username}, Missing Permission`
		)
		.setColor("RED");
	if (!message.member.hasPermission("MANAGE_MESSAGES")) {
		return message.channel.send(embed6).then(m => m.delete({ timeout: 5000 }));
	}
	const embed50 = new Discord.MessageEmbed()
		.setTitle("Command: d!mute")
		.setDescription("Usage: d!mute @user length reason")
		.setColor(0xff0000)
		.setFooter("Beta Feature");
	if (!tomute) return message.channel.send(embed50);
	const notice2 = new Discord.MessageEmbed()
		.setDescription(
			"<:cross1:747728200691482746> **You cannot mute yourself!**"
		)
		.setColor("RED");
	if (message.mentions.users.first().id === message.author.id)
		return message.channel.send(notice2);

	const dsfdsfsdf = new Discord.MessageEmbed()
		.setDescription(
			"<:cross1:747728200691482746> Access Denied, **that member has roles higher or equal to you!**"
		)
		.setColor("RED");
	const sdfsdfsdfsd = new Discord.MessageEmbed()
		.setDescription(
			"<:cross1:747728200691482746> Access Denied, **that member has roles higher or equal to me!**"
		)
		.setColor("RED");
	const sdfsdfsdfsssd = new Discord.MessageEmbed()
		.setDescription(
			"<:cross1:747728200691482746> You can only maxium muting this user for 14 days!"
		)
		.setColor("RED");
	const dddfs = new Discord.MessageEmbed()
		.setDescription(
			"<:cross1:747728200691482746> Please Type the muting period!"
		)
		.setColor("RED");
	const botRolePossition = message.guild.member(client.user).roles.highest
		.position;
	const rolePosition = message.guild.member(tomute).roles.highest.position;
	const userRolePossition = message.member.roles.highest.position;
	if (userRolePossition <= rolePosition) return message.channel.send(dsfdsfsdf);
	if (botRolePossition <= rolePosition)
		return message.channel.send(sdfsdfsdfsd);

	let muterole = client.guilds.cache
		.get(message.guild.id)
		.roles.cache.find(val => val.name === "Muted");
	if (!muterole) {
		try {
			muterole = await message.guild.createRole({
				name: "Muted",
				color: "#000000",
				permissions: [],
			});
			message.guild.channels.forEach(async (channel, id) => {
				await channel.overwritePermissions(muterole, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false,
				});
			});
		} catch (e) {
			console.log(e.stack);
		}
	}

	// end of create role
	const mutetime = args[1];
	if (!mutetime) return message.channel.send(embed50);
	if (isNaN(ms(mutetime))) return message.channel.send(sdfsdfsdfsssd);
	if (ms(mutetime) > 1209600000) return message.channel.send(dddfs);
	let reason = args.slice(2).join(" ");
	if (reason.length < 1) reason = "No reason given.";

	const logs = message.guild.channels.cache.find(
		x => (x.name = config.logsChannel)
	);

	const embed = new Discord.MessageEmbed()
		.setTitle("Action Mute")
		.setColor("RED")
		.addField("Target", `<@${tomute.id}>`)
		.addField("User", `<@${message.author.id}>`)
		.addField("TempMute Length", `${ms(ms(mutetime))}`)
		.addField("Reason", `\`\`\`${reason}\`\`\``)
		.setTimestamp()
		.setFooter("• Mute User Information");

	const embed10 = new Discord.MessageEmbed()
		.setDescription(
			`<:tick:702386031361523723> **Muted ${tomute.username}#${
				tomute.discriminator
			} for ${ms(ms(mutetime))}** | **${reason}**`
		)
		.setColor("GREEN");

	await message.guild.member(tomute).roles.add(muterole);
	message.delete();
	message.channel.send(embed10);
	tomute.send(
		`You had been muted for **${ms(ms(mutetime))}** in **${
			message.guild.name
		}**, Reason : **${reason}**`
	);

	setTimeout(() => {
		message.guild.member(tomute).roles.remove(muterole.id);
	}, ms(mutetime));
};

module.exports.help = {
	name: "mute",
	description: "This command is used for muting some people really annoying.",
	usage: "d!mute <mention> <duration> <reason>",
	accessableby: "Manage Roles",
	aliases: [],
};
