import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    Option,
    Dropdown,
    DropdownOption,
    stopPropagation,
    getFirstIcon } from '@geosolutions/react-draft-wysiwyg';

const EXTERNAL_LINK = "External Link";

class MSLinkOptions extends Component {

    static propTypes = {
        externalLinkOption: PropTypes.string,
        onSelectionChange: PropTypes.func,
        currentSelectOption: PropTypes.string,
        availableStorySections: PropTypes.array
    };

    state = { expanded: false }

    render() {
        const { expanded } = this.state;
        const {
            externalLinkOption,
            onSelectionChange,
            currentSelectOption,
            availableStorySections } = this.props;
        return (
            <div className="rdw-block-wrapper" aria-label="rdw-block-control">
                <Dropdown
                    className="ms-rdw-link-options-dropdown"
                    onChange={onSelectionChange}
                    expanded={expanded}
                    doExpand={this.toggle}
                    doCollapse={this.toggle}
                    onExpandEvent={this.toggle}
                    title="MSLinks"
                >
                    <span>
                        {currentSelectOption}
                    </span>
                    <DropdownOption
                        active
                        value={externalLinkOption}
                        key={externalLinkOption}
                    >
            External Link
                    </DropdownOption>
                    {availableStorySections && availableStorySections.map(section => (
                        <DropdownOption
                            active={section.id === currentSelectOption}
                            value={section.id}
                            key={section.id}
                        >
                            {section.title}
                        </DropdownOption>
                    ))}
                </Dropdown>
            </div>
        );
    }

    toggle = () => {
        this.setState(prev => ({
            expanded: !prev.expanded
        }));
    }
}

class LayoutComponent extends Component {
  static propTypes = {
      expanded: PropTypes.bool,
      doExpand: PropTypes.func,
      doCollapse: PropTypes.func,
      onExpandEvent: PropTypes.func,
      config: PropTypes.object,
      onChange: PropTypes.func,
      currentState: PropTypes.object,
      translations: PropTypes.object,
      modalHandler: PropTypes.any
  };

  state = {
      showModal: false,
      linkTarget: '',
      linkTitle: '',
      attributes: {
          type: '',
          params: ''
      },
      linkTargetOption: this.props.config.defaultTargetOption,
      showExternalLinkOptions: false,
      currentSelectOption: 'Select link target'
  };

  componentDidUpdate(prevProps) {
      if (prevProps.expanded && !this.props.expanded) {
          this.setState({
              showModal: false,
              linkTarget: '',
              linkTitle: '',
              attributes: {
                  type: '',
                  params: ''
              },
              linkTargetOption: this.props.config.defaultTargetOption,
              showExternalLinkOptions: false,
              currentSelectOption: 'Select link target'
          });
      }
  }

  removeLink = () => {
      const { onChange } = this.props;
      onChange('unlink');
  };

  addLink = () => {
      const { onChange } = this.props;
      const { linkTitle, linkTarget, linkTargetOption, attributes } = this.state;
      onChange('link', linkTitle, linkTarget, linkTargetOption, attributes);
  };

  updateValue = event => {
      this.setState({
          [`${event.target.name}`]: event.target.value
      });
  };

  onSelectionChange = (option) => {
      // always begin reset the showExternalLinkOptions state
      this.setState({ showExternalLinkOptions: false });
      if (option === EXTERNAL_LINK) {
          this.setState({
              linkTarget: '',
              attributes: {
                  type: '',
                  params: ''
              },
              showExternalLinkOptions: true,
              currentSelectOption: option });
      } else {
          this.setState({
              linkTarget: option,
              attributes: {
                  type: 'scrollTo',
                  params: `${option}`
              },
              currentSelectOption: option });
      }
  }

  updateTargetOption = event => {
      this.setState({
          linkTargetOption: event.target.checked ? '_blank' : '_self'
      });
  };

  hideModal = () => {
      this.setState({
          showModal: false
      });
  };

  signalExpandShowModal = () => {
      const {
          onExpandEvent,
          currentState: { link, selectionText }
      } = this.props;
      const { linkTargetOption } = this.state;
      onExpandEvent();
      this.setState({
          showModal: true,
          linkTarget: (link && link.target) || '',
          linkTargetOption: (link && link.targetOption) || linkTargetOption,
          linkTitle: (link && link.title) || selectionText,
          attributes: {
              type: '',
              params: ''
          }
      });
  };

  forceExpandAndShowModal = () => {
      const {
          doExpand,
          currentState: { link, selectionText }
      } = this.props;
      const { linkTargetOption } = this.state;
      doExpand();
      this.setState({
          showModal: true,
          linkTarget: link && link.target,
          linkTargetOption: (link && link.targetOption) || linkTargetOption,
          linkTitle: (link && link.title) || selectionText,
          attributes: {
              type: '',
              params: ''
          }
      });
  };

  renderAddLinkModal() {
      const {
          config: { popupClassName },
          doCollapse,
          translations,
          availableStorySections
      } = this.props;
      const {
          linkTitle,
          linkTarget,
          linkTargetOption,
          showExternalLinkOptions,
          currentSelectOption } = this.state;
      return (
          <div
              className={classNames('rdw-link-modal', popupClassName)}
              onClick={stopPropagation}
          >
              <label className="rdw-link-modal-label" htmlFor="linkTitle">
                  {translations['components.controls.link.linkTitle']}
              </label>
              <input
                  id="linkTitle"
                  className="rdw-link-modal-input"
                  onChange={this.updateValue}
                  onBlur={this.updateValue}
                  name="linkTitle"
                  value={linkTitle}
              />
              <label className="rdw-link-modal-label" htmlFor="linkTarget">
                  {translations['components.controls.link.linkTarget']}
              </label>
              <MSLinkOptions
                  externalLinkOption={EXTERNAL_LINK}
                  currentSelectOption={currentSelectOption}
                  onSelectionChange={this.onSelectionChange}
                  availableStorySections={availableStorySections} />
              {showExternalLinkOptions && (
          <>
            <input
                id="linkTarget"
                className="rdw-link-modal-input"
                onChange={this.updateValue}
                onBlur={this.updateValue}
                name="linkTarget"
                value={linkTarget}
            />
            <label
                className="rdw-link-modal-target-option"
                htmlFor="openLinkInNewWindow"
            >
                <input
                    id="openLinkInNewWindow"
                    type="checkbox"
                    defaultChecked={linkTargetOption === '_blank'}
                    value="_blank"
                    onChange={this.updateTargetOption}
                />
                <span>
                    {translations['components.controls.link.linkTargetOption']}
                </span>
            </label>
          </>
              )}
              <span className="rdw-link-modal-buttonsection">
                  <button
                      className="rdw-link-modal-btn"
                      onClick={this.addLink}
                      disabled={!linkTarget || !linkTitle}
                  >
                      {translations['generic.add']}
                  </button>
                  <button className="rdw-link-modal-btn" onClick={doCollapse}>
                      {translations['generic.cancel']}
                  </button>
              </span>
          </div>
      );
  }

  renderInFlatList() {
      const {
          config: { options, link, unlink, className },
          currentState,
          expanded,
          translations
      } = this.props;
      const { showModal } = this.state;
      return (
          <div
              className={classNames('rdw-link-wrapper', className)}
              aria-label="rdw-link-control"
          >
              {options.indexOf('link') >= 0 && (
                  <Option
                      value="unordered-list-item"
                      className={classNames(link.className)}
                      onClick={this.signalExpandShowModal}
                      aria-haspopup="true"
                      aria-expanded={showModal}
                      title={link.title || translations['components.controls.link.link']}
                  >
                      <img src={link.icon} alt="" />
                  </Option>
              )}
              {options.indexOf('unlink') >= 0 && (
                  <Option
                      disabled={!currentState.link}
                      value="ordered-list-item"
                      className={classNames(unlink.className)}
                      onClick={this.removeLink}
                      title={
                          unlink.title || translations['components.controls.link.unlink']
                      }
                  >
                      <img src={unlink.icon} alt="" />
                  </Option>
              )}
              {expanded && showModal ? this.renderAddLinkModal() : undefined}
          </div>
      );
  }

  renderInDropDown() {
      const {
          expanded,
          onExpandEvent,
          doCollapse,
          doExpand,
          onChange,
          config,
          currentState,
          translations
      } = this.props;
      const {
          options,
          link,
          unlink,
          className,
          dropdownClassName,
          title
      } = config;
      const { showModal } = this.state;
      return (
          <div
              className="rdw-link-wrapper"
              aria-haspopup="true"
              aria-label="rdw-link-control"
              aria-expanded={expanded}
              title={title}
          >
              <Dropdown
                  className={classNames('rdw-link-dropdown', className)}
                  optionWrapperClassName={classNames(dropdownClassName)}
                  onChange={onChange}
                  expanded={expanded && !showModal}
                  doExpand={doExpand}
                  doCollapse={doCollapse}
                  onExpandEvent={onExpandEvent}
              >
                  <img src={getFirstIcon(config)} alt="" />
                  {options.indexOf('link') >= 0 && (
                      <DropdownOption
                          onClick={this.forceExpandAndShowModal}
                          className={classNames('rdw-link-dropdownoption', link.className)}
                          title={
                              link.title || translations['components.controls.link.link']
                          }
                      >
                          <img src={link.icon} alt="" />
                      </DropdownOption>
                  )}
                  {options.indexOf('unlink') >= 0 && (
                      <DropdownOption
                          onClick={this.removeLink}
                          disabled={!currentState.link}
                          className={classNames(
                              'rdw-link-dropdownoption',
                              unlink.className
                          )}
                          title={
                              unlink.title || translations['components.controls.link.unlink']
                          }
                      >
                          <img src={unlink.icon} alt="" />
                      </DropdownOption>
                  )}
              </Dropdown>
              {expanded && showModal ? this.renderAddLinkModal() : undefined}
          </div>
      );
  }

  render() {
      const {
          config: { inDropdown }
      } = this.props;
      if (inDropdown) {
          return this.renderInDropDown();
      }
      return this.renderInFlatList();
  }
}

export default LayoutComponent;
