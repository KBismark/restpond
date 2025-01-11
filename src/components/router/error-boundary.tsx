import React, { Component, ErrorInfo } from 'react';
import { router } from '.';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage loaded={true} />;
    }

    return this.props.children;
  }
}



function ErrorPage({loaded}:{loaded:boolean}){
    return (
        <div style={{textAlign:'center'}}>
            <h1>(ERROR 404) PAGE NOT FOUND</h1>
            <button onClick={()=>router.push({pathname:'/'})}>Go to home page</button>
        </div>
    )
}




export default ErrorBoundary;