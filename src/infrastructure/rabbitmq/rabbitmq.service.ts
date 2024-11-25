import { Injectable } from '@nestjs/common';
import { Connection, Channel, connect } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;

  async connect(): Promise<void> {
    if (!this.connection) {
      this.connection = await connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    }
    if (!this.channel) {
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(process.env.QUEUE , { durable: true });
    }
  }

  async sendToQueue(queue: string, message: string): Promise<void> {
    await this.connect();
    this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
  }

  async consume(queue: string, callback: (msg: string) => void): Promise<void> {
    await this.connect();
    await this.channel.consume(queue, (msg) => {
      if (msg) {
        callback(msg.content.toString());
        this.channel.ack(msg);
      }
    });
  }
}
