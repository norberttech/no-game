<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20170506210959 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE nogame_account (id UUID NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN nogame_account.id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE nogame_character (
              id UUID NOT NULL, 
              account_id UUID NOT NULL, 
              name VARCHAR(255) NOT NULL, 
              normalized_name VARCHAR(255) NOT NULL, 
              health INT NOT NULL, 
              current_health INT NOT NULL, 
              experience INT NOT NULL, 
              spawn_pos_x INT NOT NULL,
              spawn_pos_y INT NOT NULL,
              pos_x INT NOT NULL,
              pos_y INT NOT NULL,
              PRIMARY KEY(id)
          )');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_73A9BEF6D69C0128 ON nogame_character (normalized_name)');
        $this->addSql('COMMENT ON COLUMN nogame_character.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN nogame_character.account_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE nogame_credentials (id UUID NOT NULL, account_id UUID NOT NULL, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, salt VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_E4715016E7927C74 ON nogame_credentials (email)');
        $this->addSql('COMMENT ON COLUMN nogame_credentials.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN nogame_credentials.account_id IS \'(DC2Type:uuid)\'');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP TABLE nogame_account');
        $this->addSql('DROP TABLE nogame_character');
        $this->addSql('DROP TABLE nogame_credentials');
    }
}
