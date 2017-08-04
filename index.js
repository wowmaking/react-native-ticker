import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Animated, Easing, } from 'react-native';


export default class ReactNativeTicker extends PureComponent {

    static propTypes = {
        content: PropTypes.element.isRequired,
        duration: PropTypes.number,
    };

    static defaultProps = {
        duration: 7500,
    };

    constructor(props) {
        super(props);

        this.state = {
            layoutWidth: 400,
            xAnim: new Animated.Value(0),
        };

        this.handleRef = this.handleRef.bind(this);
        this.handleLayout = this.handleLayout.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this._startAnim();
    }

    _startAnim() {
        Animated.timing(
            this.state.xAnim,
            {
                toValue: 1,
                duration: this.props.duration,
                easing: Easing.linear,
            }
        ).start(() => {
            this.state.xAnim.setValue(0);
            this.ref.scrollTo({ x: this.x + this.state.layoutWidth, animated: false, });
            this._startAnim();
        });
    }

    render() {
        var props = this.props,
            state = this.state;

        return (
            <Animated.View style={{
                transform: [{
                    translateX: state.xAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -this.state.layoutWidth],
                    }),
                }],
                width: '200%',
            }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ref={this.handleRef}
                    onLayout={this.handleLayout}
                    onScroll={this.handleScroll}
                >
                    {props.content}
                    {props.content}
                    {props.content}
                    {props.content}
                </ScrollView>
            </Animated.View>
        );
    }

    handleRef(ref) {
        this.ref = ref;
    }

    handleLayout(e) {
        this.ref.scrollTo({ x: 1, });
        
        this.setState({
            layoutWidth: e.nativeEvent.layout.width / 2,
        });
    }

    handleScroll(e) {
        var { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent,
            x = contentOffset.x;

        var w = contentSize.width / 4;

        if (x <= 0) {
            this.ref.scrollTo({ x: x + w, animated: false });
        }
        else if (layoutMeasurement.width + x >= w * 3) {
            this.ref.scrollTo({ x: x - w, animated: false });
        }

        this.x = x;
    }

}
