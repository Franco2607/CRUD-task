import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';


@Module({
  imports: [
    
    ConfigModule.forRoot({ isGlobal: true}),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        //Aca se conecta a la base de datos
        type: 'postgres',
        url: ConfigService.get<string>('DATABASE_URL'),
        ssl: true, //importante para la base de datos en la nube
        autoLoadEntities: true,
        synchronize: true, //Para crear las tablas automaticamente
      })
    }),
  TasksModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
