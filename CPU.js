const createMemmory = require('./memmory');
const {
  MOV_LIT_R1,
  MOV_LIT_R2,
  ADD_REG_REG
} = require('./instructions');
module.exports = class CPU {
  constructor(memmory){
    this.memmory = memmory
    this.registerNames = [
      'ip', 'acc',
      'r1', 'r2', 'r3', 'r4',
      'r5', 'r6', 'r7', 'r8',
    ];
    this.registers = createMemmory(this.registerNames.length * 2);

    this.registerMap = this.registerNames.reduce((map, name, i) => {
      map[name]= i*2;
      return map;
    }, {})
  }

  debug(){
    this.registerNames.forEach(name => {
      console.log(`${name}: ${this.getRegister(name).toString(16).padStart(4, '0')}`)
    })
    console.log();
  }
  
  getRegister(name){
    if(!name in this.registerNames){
      throw new Error('register does not exist');
    }
    return this.registers.getUint16(this.registerMap[name]);
  }

  setRegister(name,value){
    if(!name in this.registerNames){
      throw new Error('register does not exist');
    }
    return this.registers.setUint16(this.registerMap[name], value);
  }

  fetch(){
    const nextInstructionSet = this.getRegister('ip');
    const instructions = this.memmory.getUint8(nextInstructionSet);
    this.setRegister('ip', nextInstructionSet+1);
    return instructions;
  }

  fetch16(){
    const nextInstructionSet = this.getRegister('ip');
    const instructions = this.memmory.getUint16(nextInstructionSet);
    this.setRegister('ip', nextInstructionSet+2);
    return instructions;
  }

  execute(instruction){
    switch (instruction) {
      case MOV_LIT_R1: {
        const literal = this.fetch16();
        this.setRegister('r1', literal);
        return;
      }
      case MOV_LIT_R2: {
        const literal = this.fetch16();
        this.setRegister('r2', literal);
        return;
      }

      case ADD_REG_REG: {
        const r1 = this.fetch();
        const r2 = this.fetch();
        const registerValue1 = this.registers.getUint16(r1 + 2);
        const registerValue2 = this.registers.getUint16(r2 + 2);
        this.setRegister('acc', registerValue1+ registerValue2);
        return;
      }

    }
  }
  step(){
    const instruction = this.fetch();
    return this.execute(instruction);
  }
}
