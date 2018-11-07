# Setup Development Environment

## Download project

In order to download this project you need to know `git` basics.

```
$ git clone git@github.com:norzechowicz/no-game.git
```

## Vagrant

Development should happen only in well prepared environment, to not make you life harder than it already is I created
one for you. Before you start please go to `vagrant` folder in this repository from your command line and prepare
`Vagrantfile` (yeah, from template)

```
$ cd vagrant
$ cp Vagrantfile.dist Vagrantfile
```

Before you proceed make sure following software is installed at your machine:

* [Vagrant](https://www.vagrantup.com/downloads.html)
* [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

Fine, now you should be able to setup virtual machine with all required software installed with single CLI command.

```
$ vagrant up
```

## Domain

When you virtual machine is ready to use please make sure following lines are available in your `/etc/hosts` file.

```
10.0.0.200      client.nogame.local
10.0.0.200      nogame.local
```

Thanks to those entries opening [https://nogame.local/app_dev.php](https://nogame.local/app_dev.php) should take you
to nogame homepage.

## Project Dependencies

Ok, it's time to install all dependencies, this operation should be done from inside of virtual machine.

Let start from homepage, build on top of Symfony framework (php)

```
$ vagrant ssh
$ cd /var/www/nogame/php/web
$ composer install
```

Now we can move to game server/client/common parts.

```
cd /var/www/nogame/nodejs/common/
npm install
npm run build

cd /var/www/nogame/nodejs/server/
npm install

cd /var/www/nogame/nodejs/client/
npm install
```

If any of above steps fail there is a good chance that dependencies are outdated (typical Javascript problem) and you
might need to update them or replace.

## Database Schema

Now when you installed all dependencies it's time to prepare database.

```
$ cd /var/www/nogame/php/web
$ composer db:reset:dev
```

That's all, above composer script will drop any existing database, create new one and update it schema according
to Doctrine ORM Schema provider.

Use this command only when you setup project from scratch.

## SSL

You probably already noticed that your https connection is not trusted, it's because SSL certificate that is used
by your virtual machine was self signed by self generated CA cert.

In order to make your connection trusted you should import `/ssl/ca.crt` file into your system certification store.
If `/ssl/` folder is empty it means your `vagrant up` command failed, you might need to run `vagrant provision`.
Please also remember that every time you destroy your virtual machine with `vagrant destroy` CA will be generated once again
and you will need to import it again.