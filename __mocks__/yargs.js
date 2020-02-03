const Yargs = function() {
    this.option = () => this;
    this.command = () => this;
    this.demandCommand = () => this;
    this.wrap = () => this;
    this.help = () => this;
    this.argv = {};
};

module.exports = new Yargs();
