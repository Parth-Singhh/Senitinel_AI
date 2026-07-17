import { Module, McpApp } from '@nitrostack/core';

@McpApp({
  module: AppModule,
})
@Module({
  name: 'app',
  imports: [],
})
export class AppModule {}