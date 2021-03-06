import { VoiceChannel } from 'discord.js'

import client from '../main'
import Command from '../structures/Command'
import clanManager from '../managers/clan'
import loveroomManager from '../managers/loveroom'
import * as logger from '../utils/logger'

export default class TestCommand extends Command {
  get cOptions() {
    return {
      allowedUsers: [
        '481427622560137230',
      ]
    }
  }

  execute() {
    logger.info([...clanManager.values()].map(clan => clan.name))
    logger.info(
      [...loveroomManager.values()].map(loveroom => {
        return ((client.channels.cache.get(loveroom.id) as VoiceChannel) || {})
          .name
      })
    )
  }
}
