/*
  1) get user input and verify and refine all possible issues
  2) split info to sectors
*/

class MaskNet {
  
  // PROPERTIES SECTION

  private _maskNet: string | null = null;
  
  private _isCIRD: boolean = false;
  private _isDDN: boolean = false;
  private _haveSubNets: boolean = false;
  
  //----------------------------------------------------

  // CONSTRUCTOR SECTION
  /**
   * Can be x.x.x.x or /x
   * 
   * @param {string} maskNet - your mask Net mask (x.x.x.x or /x)
  */
  constructor (maskNet: string){
    this.verifyMaskNet(maskNet);
    this._maskNet = maskNet;
    return this;
  }

  // MATH SECTION
  private stringValidIntFiniteNumber(string : string): boolean {
    const fByteString = parseInt(string);
    return !isNaN(fByteString) && isFinite(fByteString); 
  }

  private isEven(number: number): boolean {
    return number % 2 == 0;
  }

  /**
   * check if value can be 2^x? 
  */
  private isPowerOfTwo(n: number) {
    return  n > 0 && (n & (n - 1)) === 0
  }
  
  //----------------------------------------------------

  // DDN AND CIRD VALIDATION TESTING
  
  /**
   * Check if the DDN is valid.
   * 
   * @param {string} maskNet - the mask net
   * 
   * @throws {Error} - if the DDN is not right.
  */
  private validateDDN(maskNet: string){      
      const splitDDN = maskNet.split(".");
      
      let lastByteString;
      for (let i = 0; i < splitDDN.length; i++) {
        const byteString = splitDDN.at(i);
        if (!byteString) {
          throw new Error("Byte not found, one of the bytes is not setted, did you miss 0?")
        }
        
        const iByteString = parseInt(byteString);
        const isNumber = this.stringValidIntFiniteNumber(byteString);

        if (!isNumber) {
          throw new Error(`An byte of the mask net is NOT an valid byte number`);
        }

        // iByteString < 0 or >255 ?
        if (iByteString < 0 || iByteString > 255){
          throw new Error(`An byte of the mask net is can't be < 0 or >255`);
        }

        // if the last byte is not 255, you can't add another number without being 0
        if (lastByteString && parseInt(lastByteString) !== 255 && iByteString > 0){
          throw new Error(`An byte of the mask net is can't be > 0 \nError Example: 255.0.255.0 -> THIS WILL RETURN AN ERROR!`);
        }

        
        // this is the subnet or an local net input
        if (iByteString != 255 && iByteString.toString(2).padStart(8, '0').includes("01")){
          throw new Error(`The subnet mask must be .128 or .192 or .224 or .240 or .248 or .252`);
        }

        // subnet validation
        if (iByteString != 255 && !iByteString.toString(2).padStart(8, '0').includes("01")){
          this._haveSubNets = true;
        }
        
        // add last byte
        lastByteString = byteString;
      }

      // confirm that is an DDN 
      this._isDDN = true;
      return;
  }

   /**
   * Check if the CIRD is valid.
   * 
   * @param {string} maskNet - the mask net
   * 
   * @throws {Error} - if the CIRD is not right.
  */
  private validateCIRD(maskNet: string) {
    const clearCIRD = maskNet.replaceAll('/', '');
      const iCIRD = parseInt(clearCIRD);
      const isValidNumber = this.stringValidIntFiniteNumber(clearCIRD);
      if (!isValidNumber) {
        throw new Error(`Mask net is not an valid CIRD`)
      } 

      if (iCIRD < 0 || iCIRD > 32){
        throw new Error(`Mask net can't be <0 or >32`)
      }

      // check if CIRD have subnet
      if (iCIRD != 0 && iCIRD != 8 && iCIRD != 16 && iCIRD != 24 && iCIRD != 32) {
        this._haveSubNets = true;
      }

      // confirms that is a CIRD
      this._isCIRD = true;
      return;
  }

  //----------------------------------------------------

  // Validation Section

  /**
   * Verify if mask net is valid.
   * 
   * @param {string} maskNet - the mask net string
   * 
   * @throws {Error} if mask net string input apresent an error
   * 
  */
  private verifyMaskNet(maskNet: string){
    const clearMaskNet = maskNet.replaceAll(" ", "");
    
    // INDICATE that is a CIRD
    const isCIRD = (maskNet.split("/").length - 1) == 1; // is /x ?
    
    // INDICATE that is a DDN
    const isDDN = (maskNet.split(".").length) == 4;// is x.x.x.x ?

    // can't be CIRD and DDN  
    if (isCIRD && isDDN){
      throw new Error("Your mask net should be x.x.x.x or /x")
    }

    // is not CIRD and DDN  
    if (!isCIRD && !isDDN){
      throw new Error("Your mask net should be x.x.x.x or /x")
    }

    // can't be empty
    if (clearMaskNet.length == 0){
      throw new Error("Mask net input is empty")
    }


    if (isDDN){
      this.validateDDN(maskNet);
    }
    
    if (isCIRD) {
      this.validateCIRD(maskNet)
    }
  }
  //----------------------------------------------------

  /**
   * Get the CIRD of the mask net.
  */
  public get getCIRD(): string {
    if (this.isCIRD){
      return this._maskNet!;
    }
    
    return "/" + this._maskNet!.split('.')
           .map((oct) => {
            // lenght of all 1 on the byte
            return Number(oct).toString(2).replace(/0/g, '').length
          })
          .reduce(((pv, cv) => pv + cv), 0);
  }

  public get getDDN(): string {
    if (this._isDDN){
      return this._maskNet!;
    }

    const bitsActive = Number(this._maskNet!
                      .replace("/", ""));
   
    const ddnArrayString: string[] = new Array(Math.ceil(bitsActive/8)-1).fill("255", 0, Math.ceil(bitsActive/8)-1)
    
    const submask = parseInt((0xFF << (8 - bitsActive%8) & 0xFF).toString(2),2).toString();

    ddnArrayString.push(submask != '0' ? submask : "255");

    const ddnArrayLenght = ddnArrayString.length;
    
    for (let i = 0; i < (4 - ddnArrayLenght); i++) {
      ddnArrayString.push('0');
    }

    return ddnArrayString.join('.');
  }

  public get isDDN() : boolean {
    return this._isDDN;
  }
  
  public get isCIRD() : boolean {
    return this._isCIRD;
  }

  public get haveSubNets() : boolean {
    return this._haveSubNets;
  }

  public get getSubNets(): number {
    if (!this._haveSubNets){
      return 0;
    }

    return Math.pow(2, Number(this.getCIRD.replace('/', '')) % 8)
  }

  /**
   * Get all addresses per sub-net
  */
  public get getAddresses(): number {
    return Math.pow(2, (32 - Number(this.getCIRD.replace('/', ''))));
  }

   /**
   * Get all hosts/valids per sub-net
  */
  public get getHosts() {
    return this.getAddresses - 2;
  }

  /**
   * Get the total Address of ALL sub-nets
  */
  public get getTotalAdresses() {
    return this.getAddresses * this.getSubNets;
  }

  /**
   * Get the total hosts/valids of ALL sub-nets
  */
  public get getTotalHosts() {
    return (this.getAddresses * this.getSubNets) - (2 * this.getSubNets);
  }
}

const sn = new MaskNet("/18");
console.log(sn.isDDN);
console.log(sn.isCIRD);
console.log(sn.haveSubNets);
console.log(sn.getCIRD);
console.log(sn.getDDN);
console.log(sn.getSubNets);
console.log(sn.getAddresses);
console.log(sn.getTotalAdresses)