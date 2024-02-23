import {
  PrismaMainClient,
  ShopifySession,
} from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { Session } from '@shopify/shopify-api';
import { SessionStorage } from '@shopify/shopify-app-session-storage';

import { SessionMapper } from './session.mapper';

/**
 * A lightweight custom implementation of the Shopify PostreSQLSessionStorage that can
 * be found here:
 * https://github.com/Shopify/shopify-app-js/blob/main/packages/shopify-app-session-storage-postgresql/src/postgresql.ts
 *
 * We create our own version to get rid off the unnecessary code present in the package,
 * and to leverage the use of our Prisma Client
 */

@Injectable()
export class PostgreSQLSessionStorage implements SessionStorage {
  constructor(
    private sessionMapper: SessionMapper,
    private prisma: PrismaMainClient,
  ) {}

  /**
   * Creates or updates the given session in storage.
   *
   * @param session Session to store
   */
  async storeSession(session: Session): Promise<boolean> {
    const record = this.sessionMapper.toPersistence(session.toObject());

    await this.prisma.shopifySession.upsert({
      where: {
        id: session.id,
      },
      update: record,
      create: record,
    });

    return true;
  }

  /**
   * Loads a session from storage.
   *
   * @param id Id of the session to load
   */
  async loadSession(id: string): Promise<Session | undefined> {
    const dbSession = await this.prisma.shopifySession.findUnique({
      where: { id },
    });

    if (!dbSession) return undefined;

    const entity = this.sessionMapper.toDomain(dbSession);

    return new Session(entity);
  }

  /**
   * Deletes a session from storage.
   *
   * @param id Id of the session to delete
   */
  async deleteSession(id: string): Promise<boolean> {
    await this.prisma.shopifySession.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Deletes an array of sessions from storage.
   *
   * @param ids Array of session id's to delete
   */
  async deleteSessions(ids: string[]): Promise<boolean> {
    await this.prisma.shopifySession.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return true;
  }

  /**
   * Return an array of sessions for a given shop (or [] if none found).
   *
   * @param shop shop of the session(s) to return
   */
  async findSessionsByShop(shop: string): Promise<Session[]> {
    const dbSessions = await this.prisma.shopifySession.findMany({
      where: { shop },
    });

    const sessions: Session[] = dbSessions.map((dbSession: ShopifySession) => {
      const entity = this.sessionMapper.toDomain(dbSession);

      return new Session(entity);
    });

    return sessions;
  }
}
