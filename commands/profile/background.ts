import { Message, TextChannel } from 'discord.js'

import Book from '../../structures/Book'
import Command from '../../structures/Command'

import * as config from '../../config'

import { User } from '../../utils/db'
import { Page } from '../../structures/Book'

export default class extends Command {
  async execute(message: Message) {
    await User.getOne({ userID: message.author.id })

    const pages: Page[] = [{}]

    const book = new Book(pages, {
      actions: {
        [config.meta.emojis.deleteMessage]: {
          position: 'before',
          exec: _message => {}
        },
        [config.meta.emojis.buy]: { position: 'after', exec: _message => {} }
      }
    })
    book.send(message.channel as TextChannel)
  }
}
