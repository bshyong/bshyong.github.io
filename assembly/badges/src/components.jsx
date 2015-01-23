var TextInput = React.createClass({
  getInitialState: function() {
    return {value: null};
  },
  handleChange: function(e){
    // use e.target.value if doing something with value
    // this.setState({value: e.target.value});
    this.props.updateProductName(e.target.value);
  },
  render: function() {
    return (
      <div className="form-group">
        <label htmlFor="productName">1. Enter the name of your product</label>
        <input type="text" className="form-control" placeholder="Product name" onChange={this.handleChange} />
      </div>
    )
  }
});


var SwagType = React.createClass({
  getInitialState: function() {
    return {
      active: false,
      item: this.props.item,
      colwidth: this.props.colwidth};
    },
    componentWillReceiveProps: function(newProps) {
      this.setState({
        active: newProps.active
      });
    },
    handleClick: function() {
      this.props.respondToClick(this);
    },
    render: function() {
      var defaultImage = "https://treasure.assembly.com/assets/flag-36b9a010cd4cc717cc842a5add1a5f65.svg"
      var classes = (this.state.active ? "active " : '') + "thumbnail"

      return (
        <div className={this.state.colwidth ? ("col-md-" + this.state.colwidth) : null} onClick={this.handleClick}>
          <div className={classes}>
            <h5 style={{margin: "10px"}}>{this.state.item.name}</h5>
            <div style={{ margin: this.state.item.margin || "15px 5px 0px",
              textAlign: "center",
              minHeight: this.state.item.minHeight}}>
              <img width={this.state.item.width || "40px"} src={this.state.item.imageURL || defaultImage} />
            </div>
            {this.state.item.desc ? (<div className="caption">
            <p className="help-block">{this.state.item.desc}</p>
          </div>) : null }
        </div>
      </div>
    )

  }
});

var SwagTypeSelector = React.createClass({
  getInitialState: function() {
    return {
      itemRows: [
      [ {name: "Flag", desc: "The original swag flag", minHeight: "41px;", width: "25%", type: "flag_icon", defaultWidth: "61px", defaultHeight: "38px", transparentImageURL: "flag_text_transparent.svg"},
      {name: "Flag and Text", desc: "Freedom flag", minHeight: "41px;", imageURL: "flag_text.svg", width: "100%", type: "light_flag_banner", defaultWidth: "243px", defaultHeight: "41px", transparentImageURL: "flag_text_transparent.svg"}
      ],
      [
      {name: "Dark banner", desc: "Resizeable banner", imageURL: "dark_badge.svg", width: "100%", type: "dark_love_banner", defaultWidth: "243px", defaultHeight: "34px", transparentImageURL: "flag_text_transparent.svg"},
      {name: "Light banner", desc: "Resizeable banner", imageURL: "light_badge.svg", width: "100%", type: "light_love_banner", defaultWidth: "243px", defaultHeight: "34px", transparentImageURL: "flag_text_transparent.svg"}
      ]
      ]
    }
  },
  updateSelectedSwag: function(item) {
    this.setState({activeItem: item});
    this.props.updateSelectedSwag(item);
  },
  renderRow: function(itemRow) {
    var colwidth = 12/itemRow.length;
    var defaultImage = "https://treasure.assembly.com/assets/flag-36b9a010cd4cc717cc842a5add1a5f65.svg"

    var itemNodes = itemRow.map(function(item, i) {
      return (
        <SwagType item={item} colwidth={colwidth} key={i} active={item==this.state.activeItem} respondToClick={this.updateSelectedSwag.bind(this, item)}/>
      );
    }, this);

    return (
      <div>
        {itemNodes}
      </div>
    )
  },
  render: function() {
    var rows = this.state.itemRows.map(function(itemRow, i) {
      return (
        <div className="row" key={i}>
          {this.renderRow.bind(this, itemRow)()}
        </div>
      );
    }, this)

    return (
      <div>
        <div className="form-group">
          <label forHtml="swagTypes">2. Select a badge type</label>
        </div>
        {rows}
        <div className="row">
          <div className="col-sm-12">
            <div className="checkbox" style={{margin: "0px 10px 25px"}} onChange={this.props.toggleTransparency}>
              <label>
                <input type="checkbox"> Transparent background</input>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var CodeBox = React.createClass({
  getInitialState: function() {
    return {
      productName: "productName",
      productSlug: "product_slug",
      swag: {type: 'swag_type', imageURL: 'imageURL'}
    }
  },
  handleFocus: function(e) {
    e.target.select();
  },
  handleMouseUp: function(e) {
    e.preventDefault();
  },
  componentWillReceiveProps: function(newProps) {

    if (newProps.productName){
      this.setState({
        productName: newProps.productName,
        productSlug: this.slugifiedName(newProps.productName)
      });
    }

    if (newProps.swag) {
      this.setState({swag: newProps.swag})
    }

    this.setState({transparency: !!newProps.transparency})
  },
  slugifiedName: function(nameString) {
    return nameString.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
  },
  render: function() {
    var imageURL = this.state.transparency ? (this.state.swag.transparentImageURL || this.state.swag.imageURL) : this.state.swag.imageURL
    var imageString = "<img href='" +
    imageURL + "' width=" + this.state.swag.defaultWidth + " height=" + this.state.swag.defaultHeight + " />"
    var codeString = "<a href='https://assembly.com/" + this.state.productSlug + "?utm_campaign=assemblage&utm_source=" + this.state.productSlug + "&utm_medium=flair_widget&utm_content=" + this.state.swag.type + "'>" + imageString + "</a>"

    return (
      <div className="form-group">
        <label htmlFor="codeBox">3. Copy and paste your code snippet into your project</label>
        <textarea type="textarea" className="form-control" onFocusCapture={this.handleFocus} onMouseUpCapture={this.handleMouseUp} readOnly value={codeString} rows="4"></textarea>
      </div>
    )
  }
});

var Swag = React.createClass({
  getInitialState: function() {
    return {productName: null};
  },
  handleInputTextUpdate: function(value) {
    this.setState({productName: value});
  },
  handleSwagSelection: function(swag) {
    this.setState({swag: swag})
  },
  toggleTransparency: function() {
    this.setState({transparency: !this.state.transparency})
  },
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <h2>Assemblage</h2>
            <TextInput updateProductName={this.handleInputTextUpdate} />
            <SwagTypeSelector updateSelectedSwag={this.handleSwagSelection} toggleTransparency={this.toggleTransparency}/>
            <CodeBox productName={this.state.productName} swag={this.state.swag} transparency={this.state.transparency} />
          </div>
        </div>
      </div>
    )
  }
});

React.render(
  <Swag />,
  document.getElementById('widget-content')
)
